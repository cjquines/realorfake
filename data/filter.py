from fuzzywuzzy import fuzz, process
import csv

with open("classnames.tsv") as f:
    reader = csv.reader(f, delimiter="\t")
    real_names = set(row[0] for row in reader)

sources = {
    "small-07": "124M-01-07-500.txt",
    "small-08": "124M-01-08-500.txt",
    "small-09": "124M-01-09-500.txt",
    "medium-07": "355M-01-07-1000.txt",
    "medium-08": "355M-01-08-1000.txt",
    "medium-09": "355M-01-09-1000.txt"
}

fake_names = {}

for source, file in sources.items():
    with open(file) as f:
        for name in [l.strip() for l in f.readlines()]:
            match, score = process.extractOne(name, real_names, scorer=fuzz.ratio)
            if score < 80:
                fake_names[name] = source

with open("fakeclasses.tsv", "w") as f:
    writer = csv.writer(f, delimiter="\t")
    for name, source in fake_names.items():
        writer.writerow([name, source])
