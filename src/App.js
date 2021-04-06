import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

const App = () => {
  useEffect(() => {
    const fetch = async () => {
      const result = await axios.post(
        "http://cjq.scripts.mit.edu/backend/test.py",
        { payload: "test" },
        { withCredentials: true }
      );
      console.log(result.data);
    };
    fetch();
  }, []);

  return <div className="app">test</div>;
};

export default App;
