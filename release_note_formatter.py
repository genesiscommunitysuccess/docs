import re

# Define the list of operations
operations = [
    # String matches and replacements - add any modificaitons from original notes here (list will get large!)
    {"type": "string", "find": "FOOOO", "replace": "BARRRR"},
    {"type": "string", "find": "MOOOO", "replace": "MARRRR"},

    # Regex operations to tidy up what is produced by default and format as we want it to look
    {"type": "regex", "find": r"^[-*] (feat|fix|chore|perf|build|deps)(?:\((.*?)\))?: (.)", "replace": r"* \2 : \U\3"},
    {"type": "regex", "find": r"/\* (deps)? :", "replace": ""},
    {"type": "regex", "find": r"(?:-\s*)?(\(?[A-Z]{2,10}-\d+\)?|\[[A-Z]{2,10}-\d+\]\(https?://[^\s)]+\))?(?:\s*\(#\d+\))?\s*(\(https?://[^\s)]+\) )?by @[\w-]+ in (?:#\d+|https?://[^\s)]+)", "replace": ""},
    {"type": "regex", "find": r"(?:-\s*)?(\(?[A-Z]{2,10}-\d+\)?|\[[A-Z]{2,10}-\d+\]\(https?://[^\s)]+\))(?:\s*\(#\d+\))?\s*(\(https?://[^\s)]+\) )?by @[\w-]+ in #\d+|by @[\w-]+ in #\d+", "replace": ""},
    {"type": "regex", "find": r"(?:-\s*)?(\(?[A-Z]{2,10}-\d+\)?|\[[A-Z]{2,10}-\d+\]\(https?://[^\s)]+\))(?:\s*\(#\d+\))?\s*(\(https?://[^\s)]+\) )?by.*", "replace": ""},
    {"type": "regex", "find": r"in (/[a-zA-Z0-9_-]+(?:/[a-zA-Z0-9_-]+)*) by @\w+ in https?://[^\s)]+", "replace": r"\1"},
]

def apply_operations(file_path: str):
    # Read content
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply each operation in order
    for op in operations:
        if op["type"] == "string":
            content = content.replace(op["find"], op["replace"])
        elif op["type"] == "regex":
            content = re.sub(op["find"], op["replace"], content, flags=re.MULTILINE)

    # Write back to file (or change this to a new file if preferred)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Example usage
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python script.py <path_to_file>")
    else:
        apply_operations(sys.argv[1])
        print("File processed successfully.")
