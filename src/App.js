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

const Pair = ({ real, fake }) => {
  return (
    <div className="pair">
      <p>{real.name}</p>
      <p>{fake.name}</p>
    </div>
  );
};

const Prompt = ({ pending, real, fake }) => {
  return (
    <div className="prompt">
      <h2>Choose the real ESP class!</h2>
      {pending ? (
        <div className="pair">loading</div>
      ) : (
        <Pair real={real} fake={fake} />
      )}
      <p>Score: something</p>
    </div>
  );
};

const History = ({ history }) => {
  return (
    <div className="history">
      {history.map((i, { real, fake }) => (
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
    setPending(true);
    post("get", {}, ({ real, fake }) => {
      setReal(real);
      setFake(fake);
      setPending(false);
    });
  }, [history.length]);

  return (
    <div className="app">
      <div className="header">
        <h1>Real or Fake?</h1>
      </div>
      <Prompt pending={pending} real={real} fake={fake} />
      <History history={history} />
    </div>
  );
};

export default App;
