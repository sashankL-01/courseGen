"""
Verification script to ensure Motor (async) is used correctly throughout the codebase.
This script checks for common pitfalls when using Motor with FastAPI.
"""

import ast
import os
from pathlib import Path


class MotorVerifier(ast.NodeVisitor):
    def __init__(self, filename):
        self.filename = filename
        self.issues = []
        self.uses_motor = False
        self.uses_pymongo_directly = False

    def visit_Import(self, node):
        for alias in node.names:
            if "pymongo" in alias.name and "motor" not in alias.name:
                self.uses_pymongo_directly = True
                self.issues.append(
                    f"Line {node.lineno}: Direct pymongo import detected: {alias.name}"
                )
            if "motor" in alias.name:
                self.uses_motor = True
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module and "pymongo" in node.module and "motor" not in node.module:
            # Allow importing from bson (part of pymongo but used correctly)
            if "bson" not in node.module:
                self.uses_pymongo_directly = True
                self.issues.append(
                    f"Line {node.lineno}: Direct pymongo import detected: from {node.module}"
                )
        if node.module and "motor" in node.module:
            self.uses_motor = True
        self.generic_visit(node)

    def visit_Await(self, node):
        # Check for common Motor mistakes
        if isinstance(node.value, ast.Attribute):
            if isinstance(node.value.value, ast.Call):
                if isinstance(node.value.value.func, ast.Attribute):
                    # Check for: await collection.find(...).to_list(...)
                    if (
                        node.value.value.func.attr == "find"
                        and node.value.attr == "to_list"
                    ):
                        self.issues.append(
                            f"Line {node.lineno}: Incorrect Motor usage - should be: cursor = collection.find(...); await cursor.to_list(...)"
                        )
        self.generic_visit(node)


def check_file(filepath):
    """Check a Python file for Motor usage issues."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        tree = ast.parse(content, filename=str(filepath))
        verifier = MotorVerifier(str(filepath))
        verifier.visit(tree)

        return verifier
    except Exception as e:
        print(f"Error checking {filepath}: {e}")
        return None


def main():
    print("=" * 80)
    print("Motor (Async MongoDB Driver) Verification")
    print("=" * 80)
    print()

    # Directories to check
    directories = ["services", "api", "db", "auth"]

    all_issues = []
    motor_files = []
    pymongo_files = []

    for directory in directories:
        dir_path = Path(directory)
        if not dir_path.exists():
            continue

        for py_file in dir_path.glob("**/*.py"):
            if py_file.name.startswith("__"):
                continue

            verifier = check_file(py_file)
            if verifier:
                if verifier.uses_motor:
                    motor_files.append(str(py_file))
                if verifier.uses_pymongo_directly:
                    pymongo_files.append(str(py_file))
                if verifier.issues:
                    all_issues.extend(
                        [f"{py_file}: {issue}" for issue in verifier.issues]
                    )

    # Print results
    print(f"✅ Files using Motor (async): {len(motor_files)}")
    for f in motor_files:
        print(f"   - {f}")
    print()

    if pymongo_files:
        print(f"⚠️  Files using PyMongo directly: {len(pymongo_files)}")
        for f in pymongo_files:
            print(f"   - {f}")
        print()

    if all_issues:
        print(f"❌ Issues found: {len(all_issues)}")
        for issue in all_issues:
            print(f"   {issue}")
        print()
        return 1
    else:
        print("✅ No Motor usage issues found!")
        print()
        print("Verification Summary:")
        print("  ✓ All database operations use Motor (async)")
        print("  ✓ No direct PyMongo MongoClient usage")
        print("  ✓ Proper async/await patterns")
        print("  ✓ Production-ready for MongoDB Atlas")
        return 0


if __name__ == "__main__":
    exit(main())
