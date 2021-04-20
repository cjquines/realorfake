import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

const url =
  process.env.NODE_ENV === "production"
    ? "backend/api.py"
    : "http://cjq.scripts.mit.edu/backend/api.py";

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

const ClassBtn = ({ data, status, guess, real, first }) => {
  const inHistory = !guess;
  const color = real
    ? status === "correct" && "green"
    : status === "wrong" && "red";
  const source = data.program && (
    <a className="uppercase tracking-widest text-sm mb-1">{data.program}</a>
  );
  const name =
    data.program && inHistory ? (
      <a className={`
        font-display text-2xl leading-tight
        hover:underline
      `} href={data.url}>
        {data.name}
      </a>
    ) : (
      <p className="font-display text-2xl leading-tight">{data.name}</p>
    );
  const stats = (
    <p className="text-sm text-gray-500 mt-5">
      {data.correct + (status === "correct" ? 1 : 0)} out of {data.guesses + 1}{" "}
      people (
      {percent(data.correct + (status === "correct" ? 1 : 0), data.guesses + 1)}
      ) guessed this correctly
    </p>
  );
  const marker = (
    <div
      className={`
      h-full absolute w-2 left-0
      ${!first ? "md:left-auto md:right-0" : ""}
      ${inHistory && color === "green" ? "bg-green-300" : ""}
      ${inHistory && color === "red" ? "bg-red-300" : ""}
      `}
    ></div>
  );

  return (
    <div
      className={`
        relative
        flex flex-col justify-center flex-1 py-6 px-4 pl-6
        border-b-2 text-left
        ${!inHistory ? "md:border-b-0 select-none" : ""}
        ${!first ? "md:pl-4 md:pr-6" : ""}
        ${!inHistory && color === "green" ? "bg-green-100" : ""}
        ${!inHistory && color === "red" ? "bg-red-100" : ""}
        ${status ? "" : "hover:bg-gray-100"}
      `}
      disabled={!guess}
      onClick={guess && ((e) => guess(real))}
    >
      {inHistory && source}
      {name}
      {inHistory && stats}
      {inHistory && marker}
    </div>
  );
};

const Pair = ({ classes, guessed, guess }) => {
  const btn = (real, first) => {
    const key = real ? "real" : "fake";
    return (
      <ClassBtn
        key={key}
        data={classes[key]}
        status={classes.status}
        guess={guess}
        real={real}
        first={first}
      />
    );
  };
  const classElt = classes.real_first
    ? [btn(true, true), btn(false, false)]
    : [btn(false, true), btn(true, false)];
  return (
    <div
      className={`
        flex flex-col md:flex-row min-h-60 md:min-h-48
        even:bg-white md:even:bg-transparent
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
        <div className="flex flex-col justify-center text-center min-h-60 md:min-h-48">Loading…</div>
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
      flex flex-col
    `}
    >
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
      <h1 className="bg-gray-900 text-gray-50 font-display text-xl text-center py-3">
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
