import React, { useState } from "react";
import { fetchFromAPI, HTTPMethods } from "./api";

function App() {
  const [code, setCode] = useState<string>();

  const loadJson = async () => {
    const { data } = await fetchFromAPI("", HTTPMethods.GET);
    setCode(data);
  };
  return (
    <div className="App">
      <div className="console">
        <pre>{JSON.stringify(code, null, 4)}</pre>
      </div>
      <button onClick={loadJson}>Load</button>
    </div>
  );
}

export default App;
