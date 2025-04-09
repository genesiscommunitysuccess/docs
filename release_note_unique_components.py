#!/usr/bin/env python3
import os
import re

def extract_backtick_keywords_from_line(line):
    match = re.search(r'^\s*\*\s*`([^`]+)`\s*:', line)
    if match:
        return match.group(1)
    return None

def find_keywords_in_directory(directory_path):
    keywords = set()

    for root, _, files in os.walk(directory_path):
        for filename in files:
            file_path = os.path.join(root, filename)
            print(f"Scanning: {file_path}") 
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    for line in file:
                        keyword = extract_backtick_keywords_from_line(line)
                        print(f"Matched: {keyword}")
                        if keyword:
                            keywords.add(keyword)
            except (UnicodeDecodeError, OSError):
                # Skip binary or unreadable files
                continue

    for keyword in sorted(keywords):
        print(keyword)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python script.py <directory_path>")
    else:
        find_keywords_in_directory(sys.argv[1])
