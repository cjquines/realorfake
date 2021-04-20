# Real or Fake?

**[Real or Fake?](http://esp.scripts.mit.edu/realorfake/)** shows two classes, one real, and one fake. Click the real class. Get a good score. Inspired by [arXiv vs. snarXiv](http://snarxiv.org/vs-arxiv/) and [ESP Classes: Real or Fake?](https://www.sporcle.com/games/mitesp/esp-classes-real-or-fake).

To deploy, build, copy into `web_scripts/`. Make sure that backend scripts are marked as executable, and that [`daemon.scripts` can write data](https://scripts.mit.edu/faq/31/can-my-scripts-write-data-somewhere) in the backend folder.

Mostly an excuse for me to learn how to write backend with a small database and how to use [Tailwind](http://tailwindcss.com/).

Todo:
- Add some way to upvote fake classes with good titles. There's already a column for this, just needs implementation.
- Add a page to view the stats in the database. Otherwise, there was no reason to use one, right?
