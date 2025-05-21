#!/bin/bash

# --- Default Configuration ---
DEFAULT_GRADLE_VERSION="8.10.2"
TARGET_GRADLE_VERSION="$DEFAULT_GRADLE_VERSION"
START_DIR="."
INTERNAL_GRADLE_FLAG=false # -i option

# --- Global Variables for Downloaded Gradle ---
TEMP_GRADLE_ROOT_DIR=""
GRADLE_EXECUTABLE_TO_USE="" # Will be set to 'gradle' or path to downloaded one

# --- Helper Functions ---
usage() {
    echo "Usage: $0 [-v <version>] [-i] [<start_directory>]"
    echo ""
    echo "Traverses a folder and its subfolders. If a Gradle wrapper setup is detected"
    echo "(gradlew, gradle/wrapper/gradle-wrapper.jar, gradle/wrapper/gradle-wrapper.properties),"
    echo "it calls '<gradle_exe> wrapper --gradle-version <version>'."
    echo ""
    echo "Behavior regarding Gradle version:"
    echo "  - If -i is NOT provided: The script expects the system 'gradle' command to be"
    echo "    available on PATH and its version to match the target version. If not, it will error."
    echo "  - If -i IS provided: The script will download and use the target Gradle version internally."
    echo ""
    echo "Options:"
    echo "  -v, --target-version <version>  Specify the target Gradle version for the wrapper and for execution."
    echo "                                    (default: $DEFAULT_GRADLE_VERSION)"
    echo "  -i, --internal-gradle         Download and use the specified target Gradle version internally,"
    echo "                                    bypassing any system Gradle check."
    echo "  -h, --help                      Display this help message."
    echo ""
    echo "Arguments:"
    echo "  <start_directory>             The directory to start traversal from."
    echo "                                    (default: current directory '.') "
    echo ""
    echo "Required tools for download (if -i is used or implied): curl, unzip, mktemp."
    echo ""
    echo "Example Usages:"
    echo "  $0                            # Use system Gradle $DEFAULT_GRADLE_VERSION (must match or error)"
    echo "  $0 ./my-projects             # Same, but in ./my-projects"
    echo "  $0 -v 8.9                     # Expect system Gradle 8.9 (must match or error)"
    echo "  $0 -i -v 8.8                  # Force download and use of Gradle 8.8"
    echo "  $0 --internal-gradle --target-version 8.7 ./path/to/projects"
    exit 0
}

cleanup() {
    if [ -n "$TEMP_GRADLE_ROOT_DIR" ] && [ -d "$TEMP_GRADLE_ROOT_DIR" ]; then
        echo "INFO: Cleaning up temporary Gradle directory: $TEMP_GRADLE_ROOT_DIR"
        rm -rf "$TEMP_GRADLE_ROOT_DIR"
    fi
}

# Setup trap for cleanup
trap cleanup EXIT INT TERM

check_required_tools() {
    local missing_tool=false
    for tool in "$@"; do
        if ! command -v "$tool" &> /dev/null; then
            echo "ERROR: Required tool '$tool' is not installed or not in PATH."
            missing_tool=true
        fi
    done
    if [ "$missing_tool" = true ]; then
        echo "This tool is needed because the -i option was specified or implied."
        exit 1
    fi
}

check_system_gradle_version() {
    if ! command -v gradle &> /dev/null; then
        echo "NO_SYSTEM_GRADLE" # Special code: no gradle on PATH
        return
    fi
    local gradle_v_output
    gradle_v_output=$(gradle -v 2>/dev/null) # Suppress "Deprecated..." warnings

    if [[ "$gradle_v_output" =~ Gradle[[:space:]]+([0-9]+\.[0-9]+(\.[0-9]+)?) ]]; then
        echo "${BASH_REMATCH[1]}"
        return
    fi
    if [[ "$gradle_v_output" =~ version[[:space:]]+([0-9]+\.[0-9]+(\.[0-9]+)?) ]]; then # Fallback
        echo "${BASH_REMATCH[1]}"
        return
    fi
    echo "UNKNOWN_SYSTEM_GRADLE_VERSION" # Special code: version parsing failed
}

download_and_extract_gradle() {
    local version_to_download="$1"
    local gradle_zip_name="gradle-${version_to_download}-bin.zip"
    local gradle_url="https://services.gradle.org/distributions/${gradle_zip_name}"
    local extracted_dir_name="gradle-${version_to_download}"

    echo "INFO: Preparing to download Gradle $version_to_download..."
    check_required_tools "curl" "unzip" "mktemp"

    TEMP_GRADLE_ROOT_DIR=$(mktemp -d "${TMPDIR:-/tmp}/gradle_updater.XXXXXX")
    if [ -z "$TEMP_GRADLE_ROOT_DIR" ] || [ ! -d "$TEMP_GRADLE_ROOT_DIR" ]; then
        echo "ERROR: Failed to create temporary directory. Exiting."
        exit 1
    fi
    echo "INFO: Created temporary directory: $TEMP_GRADLE_ROOT_DIR"

    echo "INFO: Downloading $gradle_url..."
    if ! curl -# -L -f -o "$TEMP_GRADLE_ROOT_DIR/$gradle_zip_name" "$gradle_url"; then
        echo "ERROR: Failed to download Gradle from $gradle_url. Check version and network."
        exit 1
    fi

    echo "INFO: Extracting $gradle_zip_name..."
    if ! unzip -q "$TEMP_GRADLE_ROOT_DIR/$gradle_zip_name" -d "$TEMP_GRADLE_ROOT_DIR"; then
        echo "ERROR: Failed to extract $gradle_zip_name."
        exit 1
    fi

    local internal_gradle_exe_path="$TEMP_GRADLE_ROOT_DIR/$extracted_dir_name/bin/gradle"
    if [ -f "$internal_gradle_exe_path" ] && [ -x "$internal_gradle_exe_path" ]; then
        GRADLE_EXECUTABLE_TO_USE="$internal_gradle_exe_path"
        echo "INFO: Using downloaded Gradle: $GRADLE_EXECUTABLE_TO_USE"
    else
        echo "ERROR: Downloaded Gradle executable not found or not executable at $internal_gradle_exe_path."
        exit 1
    fi
}

# --- Option Parsing (using getopt) ---
TEMP=$(getopt -o hv:i --long help,target-version:,internal-gradle -n "$0" -- "$@")
if [ $? != 0 ] ; then echo "Terminating..." >&2 ; exit 1 ; fi
eval set -- "$TEMP"
unset TEMP

while true; do
    case "$1" in
        -h|--help)
            usage
            ;;
        -v|--target-version)
            TARGET_GRADLE_VERSION="$2"
            shift 2
            ;;
        -i|--internal-gradle)
            INTERNAL_GRADLE_FLAG=true
            shift
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Internal error in option parsing!"
            exit 1
            ;;
    esac
done

# Remaining arguments are positional (for start_directory)
if [ -n "$1" ]; then
    START_DIR="$1"
fi

# --- Determine which Gradle executable to use ---
if [ "$INTERNAL_GRADLE_FLAG" = true ]; then
    echo "INFO: -i option specified. Will download and use Gradle $TARGET_GRADLE_VERSION."
    download_and_extract_gradle "$TARGET_GRADLE_VERSION"
else
    # -i not specified, rely on system Gradle matching target version
    echo "INFO: -i option not specified. Checking system Gradle against target version $TARGET_GRADLE_VERSION..."
    SYSTEM_GRADLE_VERSION=$(check_system_gradle_version)

    if [ "$SYSTEM_GRADLE_VERSION" = "$TARGET_GRADLE_VERSION" ]; then
        if ! command -v gradle &> /dev/null; then # Should not happen if version was matched but good sanity check
            echo "ERROR: System Gradle version matched, but 'gradle' command is not found. This is unexpected."
            echo "       Please ensure Gradle $TARGET_GRADLE_VERSION is correctly installed and on your PATH."
            exit 1
        fi
        echo "INFO: System Gradle version ($SYSTEM_GRADLE_VERSION) matches target. Using system 'gradle'."
        GRADLE_EXECUTABLE_TO_USE="gradle"
    elif [ "$SYSTEM_GRADLE_VERSION" = "NO_SYSTEM_GRADLE" ]; then
        echo "------------------------------------------------------------------------------------"
        echo "ERROR: No 'gradle' command found on your system PATH."
        echo "       To proceed, either:"
        echo "         1. Install Gradle $TARGET_GRADLE_VERSION globally and ensure it's in your PATH."
        echo "         2. Run this script with the -i (or --internal-gradle) option to"
        echo "            download and use Gradle $TARGET_GRADLE_VERSION temporarily for this execution."
        echo "------------------------------------------------------------------------------------"
        exit 1
    elif [ "$SYSTEM_GRADLE_VERSION" = "UNKNOWN_SYSTEM_GRADLE_VERSION" ]; then
        echo "------------------------------------------------------------------------------------"
        echo "ERROR: Could not determine the version of the 'gradle' command found on your system PATH."
        echo "       The script requires Gradle version $TARGET_GRADLE_VERSION."
        echo "       To proceed, either:"
        echo "         1. Ensure Gradle $TARGET_GRADLE_VERSION is correctly installed and its version is detectable."
        echo "         2. Run this script with the -i (or --internal-gradle) option to"
        echo "            download and use Gradle $TARGET_GRADLE_VERSION temporarily for this execution."
        echo "------------------------------------------------------------------------------------"
        exit 1
    else # System Gradle exists but version does not match
        echo "------------------------------------------------------------------------------------"
        echo "ERROR: Your system 'gradle' command (version: $SYSTEM_GRADLE_VERSION) does not match the"
        echo "       target version required by this script ($TARGET_GRADLE_VERSION)."
        echo "       To proceed, either:"
        echo "         1. Install/switch to Gradle $TARGET_GRADLE_VERSION globally and ensure it's in your PATH."
        echo "         2. Run this script with the -i (or --internal-gradle) option to"
        echo "            download and use Gradle $TARGET_GRADLE_VERSION temporarily for this execution."
        echo "------------------------------------------------------------------------------------"
        exit 1
    fi
fi

# Final check for GRADLE_EXECUTABLE_TO_USE (should be set or script exited)
if [ -z "$GRADLE_EXECUTABLE_TO_USE" ]; then
    echo "CRITICAL ERROR: Gradle executable to use was not determined, and script did not exit as expected. Exiting."
    exit 1
fi

# --- Main Logic ---
COMMAND_TO_RUN="$GRADLE_EXECUTABLE_TO_USE wrapper --gradle-version $TARGET_GRADLE_VERSION"

# Ensure the start directory exists and is a directory
if [ ! -d "$START_DIR" ]; then
    echo "Error: Start directory '$START_DIR' not found or is not a directory."
    exit 1
fi

echo "==================================================="
echo "Starting traversal in: $(realpath "$START_DIR")"
echo "Target Gradle wrapper version: $TARGET_GRADLE_VERSION"
echo "Using Gradle executable: $GRADLE_EXECUTABLE_TO_USE"
echo "Command to run if conditions met: $COMMAND_TO_RUN"
echo "==================================================="

find "$(realpath "$START_DIR")" -type d -print0 | while IFS= read -r -d $'\0' current_dir; do
    gradlew_present=false
    if [ -f "$current_dir/gradlew" ] || [ -f "$current_dir/gradlew.bat" ]; then
        gradlew_present=true
    fi

    if $gradlew_present && \
       [ -f "$current_dir/gradle/wrapper/gradle-wrapper.jar" ] && \
       [ -f "$current_dir/gradle/wrapper/gradle-wrapper.properties" ]; then

        echo ""
        echo "Found existing Gradle wrapper setup in: \"$current_dir\""

        echo "  Changing to directory: \"$current_dir\""
        ( # Use a subshell
            cd "$current_dir" || { echo "  ERROR: Could not cd into \"$current_dir\". Skipping."; exit 1; }

            echo "  Executing command: $COMMAND_TO_RUN"
            if $COMMAND_TO_RUN; then
                echo "  Successfully executed command in \"$current_dir\""
            else
                echo "  ERROR: Command failed in \"$current_dir\" (exit code: $?)"
            fi
        ) # Subshell ends
        echo "---------------------------------------------------"
    fi
done

echo ""
echo "Traversal complete."
# Cleanup is handled by the trap
