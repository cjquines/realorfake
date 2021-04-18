#!/usr/bin/env python3

from db import get_class_pair, update_guess, update_upvote
from io import TextIOWrapper
import sys
import json


def cors():
    print("Access-Control-Allow-Origin: http://localhost:3000")
    print("Access-Control-Allow-Headers: Content-Type")
    print("Access-Control-Allow-Methods: POST,OPTIONS")
    print("Access-Control-Allow-Credentials: true")


def exit(status, payload=""):
    print("Content-Type: application/json")
    print()
    response = {
        "status": status,
        "payload": payload,
    }
    print(json.dumps(response))
    sys.exit(0)


def get(request, key):
    result = request.get(key, None)
    if result is None:
        exit("error", "can't parse %s: %s" % (key, result))
    return result


def main():
    sys.stdin = TextIOWrapper(sys.stdin.detach(), encoding="utf8")
    sys.stdout = TextIOWrapper(sys.stdout.detach(), encoding="utf8")
    cors()

    try:
        request = json.load(sys.stdin)
    except Exception as e:
        exit("error", "can't parse json: %s" % str(e))

    type_ = request.get("type", None)

    if type_ == "get":
        real, fake = get_class_pair()
        exit("success", {"real": real, "fake": fake})

    elif type_ == "guess":
        real_rowid = get(request, "real_rowid")
        fake_rowid = get(request, "fake_rowid")
        correct = get(request, "correct")
        update_guess(real_rowid, fake_rowid, correct)
        exit("success")

    elif type_ == "upvote":
        rowid = get(request, "rowid")
        update_upvote(rowid)
        exit("success")

    else:
        exit("error", "can't parse type %s" % str(type_))


if __name__ == "__main__":
    main()
