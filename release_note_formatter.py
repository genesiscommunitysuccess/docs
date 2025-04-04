import re
import os

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

def apply_operations_to_file(file_path: str):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for op in operations:
        if op["type"] == "string":
            content = content.replace(op["find"], op["replace"])
        elif op["type"] == "regex":
            content = re.sub(op["find"], op["replace"], content, flags=re.MULTILINE)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def process_folder(folder_path: str):
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.mdx'):
                full_path = os.path.join(root, file)
                apply_operations_to_file(full_path)
                print(f"Processed: {full_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python script.py <path_to_folder>")
    else:
        process_folder(sys.argv[1])
        print("All .mdx files processed successfully.")
