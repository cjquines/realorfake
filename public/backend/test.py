#!/usr/bin/env python3

from db import get_class_pair, update_real_guess, update_fake_guess, update_fake_upvote
from io import TextIOWrapper
import sys
import json


def main():
    print(get_class_pair())
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
