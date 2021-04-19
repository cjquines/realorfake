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
  return (
    <button
      className={status ? "green" : ""}
      disabled={!guess}
      onClick={(e) => guess(real)}
    >
      {data.name}
    </button>
  );
};

const Pair = ({ real, fake, status, guess }) => {
  return (
    <div className="pair">
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
    <div className="prompt">
      <h2>Choose the real ESP class!</h2>
      {pending ? (
        <div className="pair">Loading…</div>
      ) : (
        <Pair real={real} fake={fake} status={status} guess={guess} />
      )}
      <p>Score: something</p>
    </div>
  );
};

const History = ({ history }) => {
  return (
    <div className="history">
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
    <div className="app">
      <div className="header">
        <h1>Real or Fake?</h1>
      </div>
      <Prompt
        pending={pending}
        real={real}
        fake={fake}
        pushHistory={pushHistory}
      />
      <History history={history} />
    </div>
  );
};

export default App;
