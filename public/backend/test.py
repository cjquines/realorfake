#!/usr/bin/env python3

import sys
import json
from io import TextIOWrapper


def main():
    sys.stdin = TextIOWrapper(sys.stdin.detach(), encoding="utf8")
    sys.stdout = TextIOWrapper(sys.stdout.detach(), encoding="utf8")

    request = json.load(sys.stdin)

    print("Content-Type: application/json")
    print()
    print(json.dumps({"message": "test"}))


if __name__ == "__main__":
    main()
