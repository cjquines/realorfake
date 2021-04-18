#!/usr/bin/env python3

"""
real:
    class name / parent program / url / guesses / correct guesses
fake:
    class name / guesses / correct guesses
"""


import sys
import json
from io import TextIOWrapper


def main():
    sys.stdin = TextIOWrapper(sys.stdin.detach(), encoding="utf8")
    sys.stdout = TextIOWrapper(sys.stdout.detach(), encoding="utf8")

    print("Access-Control-Allow-Origin: http://localhost:3000")
    print("Access-Control-Allow-Headers: Content-Type")
    print("Access-Control-Allow-Methods: POST,OPTIONS")
    print("Access-Control-Allow-Credentials: true")

    try:
        request = json.load(sys.stdin)
    except Exception as e:
        print("Content-Type: application/json")
        print()
        print(json.dumps({"status": "error"}))
        sys.exit(0)

    # request.get("type", None)

    print("Content-Type: application/json")
    print()
    print(json.dumps({"message": "test"}))


if __name__ == "__main__":
    main()
