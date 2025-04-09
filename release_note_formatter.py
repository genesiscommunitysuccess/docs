#!/usr/bin/env python3

import re
import os

# Define the list of operations
operations = [

    # Regex operations to tidy up what is produced by default and format as we want it to look
    
    # This will neaten the start string... removing feat/fix etc... and formatting the first letter to be a capital - keeping the component if one is defined
    {"type": "regex", "find": r"^[-*] (feat|fix|chore|perf|build|deps)(!?)(?:\((.*?)\))?(!?)?: (.)", "replace": "* `\2` : \\U\\3"},
    # This will normalise any which had no component so we don't have a random : at the start
    {"type": "regex", "find": r"^\*\s+``\s+: ", "replace": "* "},
    # This will remove (deps) prefixes that are left
    {"type": "regex", "find": r"^\*\s+`deps`\s+: ", "replace": "* "},
    # This starts to tidy up the end of the statements, removing developer names, jira IDs and other bits we don't want in the release notes
    {"type": "regex", "find": r"(?:-\s*)?(\(?[A-Z]{2,10}-\d+\)?|\[[A-Z]{2,10}-\d+\]\(https?://[^\s)]+\))?(?:\s*\(#\d+\))?\s*(\(https?://[^\s)]+\) )?by @[\w-]+ in (?:#\d+|https?://[^\s)]+)", "replace": ""},
    
    # This was in manual steps but doesn't seem to be needed now. Keep here and in the right order for next few releases in case we find it to help
    #{"type": "regex", "find": r"(?:-\s*)?(\(?[A-Z]{2,10}-\d+\)?|\[[A-Z]{2,10}-\d+\]\(https?://[^\s)]+\))(?:\s*\(#\d+\))?\s*(\(https?://[^\s)]+\) )?by @[\w-]+ in #\d+|by @[\w-]+ in #\d+", "replace": ""},
    #{"type": "regex", "find": r"(?:-\s*)?(\(?[A-Z]{2,10}-\d+\)?|\[[A-Z]{2,10}-\d+\]\(https?://[^\s)]+\))(?:\s*\(#\d+\))?\s*(\(https?://[^\s)]+\) )?by.*", "replace": ""},
    #{"type": "regex", "find": r"in (/[a-zA-Z0-9_-]+(?:/[a-zA-Z0-9_-]+)*) by @\w+ in https?://[^\s)]+", "replace": r"\1"},

    # This will remove the tail of the dependabot version bump commit messages
    {"type": "regex","find": r"\s+in /genesis[\w/-]*","replace": ""},

    # String matches and replacements - add any modificaitons from original notes here (list will get large!)
    #{"type": "string", "find": "FOOOO", "replace": "BARRRR"},
    {"type": "string", "find": "`db` : Correct upsert operation on SQL", "replace": "`genesis-db` :  Fixed an issue with `upsertAll` in SQL layer where it was unable to handle records where the primary key was not populated but is an autoIncrement or sequenced field"},
    {"type": "string", "find": "`db` : Fixed an issue with `upsertAll` in SQL layer where it was unable to handle records where the primary key was not populated but is an autoIncrement or sequenced field", "replace": "`genesis-db` :  Fixed an issue with `upsertAll` in SQL layer where it was unable to handle records where the primary key was not populated but is an autoIncrement or sequenced field"},
    {"type": "string", "find": "* `db` : Do not refresh updates that have moved in or out of range", "replace": "* `genesis-db` : Do not refresh updates that have moved in or out of range"},
    {"type": "string", "find": "* `db` : When db cache inserts are enabled, write inserts to the cache if existing cache entry value is null", "replace": "* `genesis-db` : When db cache inserts are enabled, write inserts to the cache if existing cache entry value is null"},
    {"type": "string", "find": "* `db` : Change default Backwards Join Cache mode to Sync", "replace": "* `genesis-db` : Change default Backwards Join Cache mode to Sync"},
    {"type": "string", "find": "`genesis-transform` : Added predicate expression structure to criteria API and replaced rowFilters in transformer configuration", "replace": "`genesis-transform` : Added predicate expression structure to criteria API and replaced `rowFilters` in transformer configuration"},
    {"type": "string", "find": "`genesis-criteria` : Added additional functions in criteria API (isNullOrBlank, longtoDate, longToDateTime)", "replace": "`genesis-criteria` : Added additional functions in criteria API (`isNullOrBlank`, `longtoDate`, `longToDateTime`)"},
    {"type": "string", "find": "Add support for `GENESIS_HOME` in templt.xml files ", "replace": "Add support for `GENESIS_HOME` in `templt.xml` files"},
    {"type": "string", "find": "Expose properties for sessionTimeout, verifyServerIdentity, trustedSslHosts and trustAllSslHosts in Email Gateway configuration", "replace": "Expose properties for `sessionTimeout`, `verifyServerIdentity`, `trustedSslHosts` and `trustAllSslHosts` in Email Gateway configuration"},
    {"type": "string", "find": "`pal-dataserver` : Data server priming progress", "replace": "`pal-dataserver` : Fixed an issue where priming progress was incorrectly printing 0 rather than the amount of records it has processed" },
    {"type": "string", "find": "Improve genesis set handling in GenesisMessageClient", "replace": "Fixed a test-only edge case in GenesisMessageClient where event message type, correctly registered with EventReply, was expected to return a GenesisSet in a specific test path. This mismatch caused type errors, now resolved by transforming the reply into a GenesisSet where needed" },

    # General tidy up
    {"type": "string", "find": "* `db`", "replace": "* `genesis-db`"},
    {
        "type": "regex",
        "find": r"(?<![`\\w])\bGenesisMessageClient\b(?![`\\w])",
        "replace": r"`GenesisMessageClient`"
    },
]

def apply_operations_to_file(file_path: str):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for op in operations:
        if op["type"] == "string":
            content = content.replace(op["find"], op["replace"])
        elif op["type"] == "regex":
          special_case_pattern = r"^[-*] (feat|fix|chore|perf|build|deps)(!?)(?:\((.*?)\))?(!?)?: (.)"
          for op in operations:
              if op["type"] == "string":
                  content = content.replace(op["find"], op["replace"])
              elif op["type"] == "regex":
                  if op["find"] == special_case_pattern:
                      content = re.sub(
                          special_case_pattern,
                          lambda m: f"* `{m.group(3) or ''}` : {m.group(5).upper()}",
                          content,
                          flags=re.MULTILINE
                      )
                  else:
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
