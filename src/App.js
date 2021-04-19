import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

const url = "http://cjq.scripts.mit.edu/backend/api.py";

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
  const source = <p className="uppercase tracking-widest text-sm mb-1">{data.source || data.program}</p>;
  const stats = <p className="text-sm text-gray-500 mt-5">{data.guesses} out of {data.correct} people (100%) guessed this correctly</p>;

  return (
    <div
      // className={status ? "green" : ""}
      className={`
        flex flex-col justify-center flex-1 p-4
        border-b-2 md:border-b-0
        text-left hover:text-green-800
        hover:bg-green-50
      `}
      disabled={!guess}
      onClick={(e) => guess(real)}
    >
      {guess ? null : source}
      <p className="font-display text-2xl leading-tight">{data.name}</p>
      {guess ? null : stats}
    </div>
  );
};

const Pair = ({ real, fake, status, guess }) => {
  return (
    <div
      className={`
        flex flex-col md:flex-row h-60 md:h-48
      `}
    >
      <ClassBtn data={real} status={status} guess={guess} real={true} />
      <ClassBtn data={fake} status={status} guess={guess} real={false} />
    </div>
  );
};

const Prompt = ({ pending, real, fake, pushHistory }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(false);
  }, [real, fake]);

  const guess = (correct) => {
    setStatus(true);
    pushHistory();
    post("guess", {
      real_rowid: real.rowid,
      fake_rowid: fake.rowid,
      correct,
    });
  };

  return (
    <div className="max-w-3xl mx-auto md:pt-6">
      {pending ? (
        <div>Loading…</div>
      ) : (
        <Pair real={real} fake={fake} status={status} guess={guess} />
      )}
      <div className="flex flex-col sm:flex-row p-4 sm:p-0 mt-2 text-gray-600">
        <p className="flex-1 p-0 pb-1 sm:p-4">Which one is the real ESP class?</p>
        <p className="flex-1 p-0 sm:p-4"><span className="emph">3</span> correct out of <span className="emph">4</span> guesses <span className="emph">(75%)</span></p>
      </div>
    </div>
  );
};

const History = ({ history }) => {
  return (
    <div className={`
      flex flex-col-reverse
      space-y-5 space-y-reverse
    `}>
      {history.map(({ real, fake }, i) => (
        <Pair key={i} real={real} fake={fake} />
      ))}
    </div>
  );
};

const App = () => {
  const [pending, setPending] = useState(true);
  const [real, setReal] = useState({});
  const [fake, setFake] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    post("get", {}, ({ real, fake }) => {
      setReal(real);
      setFake(fake);
      setPending(false);
    });
  }, [history.length]);

  const pushHistory = () => {
    setHistory(history.concat({ real, fake }));
  };

  return (
    <div className="bg-gray-100 min-h-screen font-body">
      <h1 className="bg-gray-900 text-gray-50 font-display text-xl text-center py-3">
        Real or Fake?
      </h1>
      <div className="bg-white">
        <Prompt
          pending={pending}
          real={real}
          fake={fake}
          pushHistory={pushHistory}
        />
      </div>
      <div className="max-w-3xl mx-auto">
        <History history={history} />
      </div>
    </div>
  );
};

export default App;
