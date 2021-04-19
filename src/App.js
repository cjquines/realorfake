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
  if (status === "success") callback(payload);
};

const Pair = ({ real, fake, pushHistory }) => {
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    setCorrect(false);
  }, [real, fake]);

  const guess = (right) => {
    setCorrect(true);
    pushHistory();
  };

  return (
    <div className="pair">
      <button className={correct ? "green" : ""} onClick={(e) => guess(true)}>
        {real?.name}
      </button>
      <button className={correct ? "green" : ""} onClick={(e) => guess(false)}>
        {fake?.name}
      </button>
    </div>
  );
};

const Prompt = ({ pending, real, fake, pushHistory }) => {
  return (
    <div className="prompt">
      <h2>Choose the real ESP class!</h2>
      {pending && real && fake ? (
        <div className="pair">loading</div>
      ) : (
        <Pair real={real} fake={fake} pushHistory={pushHistory} />
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
