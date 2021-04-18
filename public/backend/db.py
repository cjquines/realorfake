import sqlite3

REAL_COLS = ["rowid", "name", "program", "url", "guesses", "correct"]
FAKE_COLS = ["rowid", "name", "source", "guesses", "correct", "requests"]


def wrap_cursor(f):
    def wrapped(*args, **kwargs):
        conn = sqlite3.connect("classes.db")
        with conn:
            c = conn.cursor()
            return f(c, *args, **kwargs)

    return wrapped


@wrap_cursor
def create_table(cur):
    cur.execute(
        """CREATE TABLE real_classes (
            name text, program text, url text, guesses int, correct int
        )"""
    )
    cur.execute(
        """CREATE TABLE fake_classes (
            name text, source text, guesses int, correct int, requests int
        )"""
    )


@wrap_cursor
def insert_real_classes(cur, classes):
    cur.executemany("INSERT INTO real_classes VALUES (?, ?, ?, 0, 0)", classes)


@wrap_cursor
def insert_fake_classes(cur, classes):
    cur.executemany("INSERT INTO fake_classes VALUES (?, ?, 0, 0, 0)", classes)


@wrap_cursor
def get_class_pair(cur):
    cur.execute("SELECT rowid, * FROM real_classes ORDER BY guesses LIMIT 1")
    real_class = {a: b for a, b in zip(REAL_COLS, cur.fetchone())}
    cur.execute("SELECT rowid, * FROM fake_classes ORDER BY guesses LIMIT 1")
    fake_class = {a: b for a, b in zip(FAKE_COLS, cur.fetchone())}
    return real_class, fake_class


@wrap_cursor
def update_real_guess(cur, rowid, correct):
    cur.execute(
        """UPDATE real_classes
        SET guesses = guesses + 1, correct = correct + ? WHERE rowid = ?""",
        (int(correct), rowid),
    )


@wrap_cursor
def update_fake_guess(cur, rowid, correct):
    cur.execute(
        """UPDATE fake_classes
        SET guesses = guesses + 1, correct = correct + ? WHERE rowid = ?""",
        (int(correct), rowid),
    )


@wrap_cursor
def update_fake_request(cur, rowid):
    cur.execute(
        """UPDATE fake_classes
        SET requests = requests + 1 WHERE rowid = ?""",
        (rowid,),
    )


if __name__ == "__main__":
    create_table()
    
