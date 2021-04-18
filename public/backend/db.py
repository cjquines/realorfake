import sqlite3

REAL_COLS = ["rowid", "name", "program", "url", "guesses", "correct"]
FAKE_COLS = ["rowid", "name", "guesses", "correct"]


def create_table(cur):
    cur.execute(
        """CREATE TABLE real_classes (
            name text, program text, url text, guesses int, correct int
        )"""
    )
    cur.execute(
        """CREATE TABLE fake_classes (
            name text, guesses int, correct int
        )"""
    )


def insert_real_classes(cur, classes):
    cur.executemany("INSERT INTO real_classes VALUES (?, ?, ?, ?, ?)", classes)


def insert_fake_classes(cur, classes):
    cur.executemany("INSERT INTO fake_classes VALUES (?, ?, ?)", classes)


def get_class_pair(cur):
    cur.execute("SELECT rowid, * FROM real_classes ORDER BY guesses LIMIT 1")
    real_class = {a: b for a, b in zip(REAL_COLS, cur.fetchone())}
    cur.execute("SELECT rowid, * FROM fake_classes ORDER BY guesses LIMIT 1")
    fake_class = {a: b for a, b in zip(FAKE_COLS, cur.fetchone())}
    return real_class, fake_class


def update_class_pair(cur, real_update, fake_update):
    cur.execute(
        "UPDATE real_classes SET guesses = ?, correct = ? WHERE rowid = ?", real_update
    )
    cur.execute(
        "UPDATE fake_classes SET guesses = ?, correct = ? WHERE rowid = ?", fake_update
    )


if __name__ == "__main__":
    conn = sqlite3.connect(":memory:")
    with conn:
        c = conn.cursor()
        create_table(c)
        insert_real_classes(c, [("class name", "splash n", "fake", 0, 0)])
        insert_fake_classes(c, [("fake class", 0, 0)])
        print(get_class_pair(c))
