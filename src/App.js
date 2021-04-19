import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

const url = "http://cjq.scripts.mit.edu/backend/api.py";

const percent = (num, denom) =>
  `${denom ? Math.floor((100 * num) / denom) : 0}%`;

const post = async (type, message, callback) => {
  const result = await axios.post(
    url,
    { ...message, type },
    { withCredentials: true }
  );
  const { status, payload } = result.data;
  if (status === "success" && callback) callback(payload);
};

const ClassBtn = ({ data, status, guess, real }) => {
  const inHistory = !guess;
  const bg = real
    ? status === "correct" && "green"
    : status === "wrong" && "red";
  const source = data.program && (
    <p className="uppercase tracking-widest text-sm mb-1">{data.program}</p>
  );
  const stats = (
    <p className="text-sm text-gray-500 mt-5">
      {data.correct + (status === "correct" ? 1 : 0)} out of {data.guesses + 1}{" "}
      people (
      {percent(data.correct + (status === "correct" ? 1 : 0), data.guesses + 1)}
      ) guessed this correctly
    </p>
  );

  return (
    <div
      className={`
        flex flex-col justify-center flex-1 p-4
        border-b-2 md:border-b-0 text-left
        ${bg === "green" ? "bg-green-50" : ""}
        ${bg === "red" ? "bg-red-50" : ""}
        ${status ? "" : "hover:text-green-800 hover:bg-green-50"}
      `}
      disabled={!guess}
      onClick={guess && ((e) => guess(real))}
    >
      {inHistory && source}
      <p className="font-display text-2xl leading-tight">{data.name}</p>
      {inHistory && stats}
    </div>
  );
};

const Pair = ({ classes, guessed, guess }) => {
  const btn = (real) => {
    const key = real ? "real" : "fake";
    return (
      <ClassBtn
        key={key}
        data={classes[key]}
        status={classes.status}
        guess={guess}
        real={real}
      />
    );
  };
  const classElt = classes.real_first
    ? [btn(true), btn(false)]
    : [btn(false), btn(true)];
  return (
    <div
      className={`
        flex flex-col md:flex-row h-60 md:h-48
      `}
    >
      {classElt}
    </div>
  );
};

const Prompt = ({ pending, classes, pushHistory }) => {
  const [guessed, setGuessed] = useState(null);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    setGuessed(false);
  }, [classes]);

  const guess = (correct) => {
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
        <div>Loading…</div>
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
    <div
      className={`
      flex flex-col-reverse
      space-y-5 space-y-reverse
    `}
    >
      {history.map((classes, i) => (
        <Pair key={i} classes={classes} />
      ))}
    </div>
  );
};

const App = () => {
  const [pending, setPending] = useState(true);
  const [classes, setClasses] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    post("get", {}, (classes) => {
      classes.real_first = Math.random() > 0.5;
      setClasses(classes);
      setPending(false);
    });
  }, [history.length]);

  const pushHistory = () => {
    setHistory(history.concat(classes));
  };

  return (
    <div className="bg-gray-100 min-h-screen font-body">
      <h1 className="bg-gray-900 text-gray-50 font-display text-xl text-center py-3">
        Real or Fake?
      </h1>
      <div className="bg-white">
        <Prompt pending={pending} classes={classes} pushHistory={pushHistory} />
      </div>
      <div className="max-w-3xl mx-auto">
        <History history={history} />
      </div>
    </div>
  );
};

export default App;
