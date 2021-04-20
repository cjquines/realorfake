import React, { useState, useEffect } from "react";
import { percent, post } from "./utils";
import Pair from "./Pair";

const Prompt = ({ pending, classes, pushHistory }) => {
  const [guessed, setGuessed] = useState(null);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    setGuessed(false);
  }, [classes]);

  const guess = (correct) => {
    if (classes.status) return;
    classes.status = correct ? "correct" : "wrong";
    setTotal((total) => total + 1);
    setCorrect((correct_) => correct_ + correct);
    setGuessed(true);
    pushHistory();
    post("guess", {
      real_rowid: classes.real.rowid,
      fake_rowid: classes.fake.rowid,
      correct,
    });
  };

  return (
    <div className="max-w-3xl mx-auto md:pt-6">
      {pending ? (
        <div className="flex flex-col justify-center text-center min-h-60 md:min-h-48">
          Loading…
        </div>
      ) : (
        <Pair classes={classes} guessed={guessed} guess={guess} />
      )}
      <div className="flex flex-col sm:flex-row p-4 sm:p-0 mt-2 text-gray-600">
        <p className="flex-1 p-0 pb-1 sm:p-4">
          Which one is the real ESP class?
        </p>
        <p className="flex-1 p-0 sm:p-4">
          <span className="emph">{correct}</span> correct out of{" "}
          <span className="emph">{total}</span> guesses{" "}
          <span className="emph">({percent(correct, total)})</span>
        </p>
      </div>
    </div>
  );
};

const History = ({ history }) => {
  return (
    <div className="flex flex-col">
      {history.map((classes, i) => (
        <Pair key={i} classes={classes} />
      ))}
    </div>
  );
};

const App = () => {
  const [seen, setSeen] = useState(0);
  const [state, setState] = useState({
    pending: true,
    classes: {},
    history: [],
  });

  useEffect(() => {
    post("get", {}, (classes) => {
      classes.real_first = Math.random() > 0.5;
      setState((state) => ({
        pending: false,
        history: !state.pending ? [state.classes].concat(state.history) : [],
        classes,
      }));
    });
  }, [seen]);

  const pushHistory = () => setSeen((seen) => seen + 1);

  return (
    <div className="bg-gray-100 min-h-screen font-body">
      <h1 className="bg-gray-900 py-3 text-gray-50 text-display text-xl text-center">
        Real or Fake?
      </h1>
      <div className="bg-white">
        <Prompt
          pending={state.pending}
          classes={state.classes}
          pushHistory={pushHistory}
        />
      </div>
      <div className="max-w-3xl mx-auto">
        <History history={state.history} />
      </div>
    </div>
  );
};

export default App;
