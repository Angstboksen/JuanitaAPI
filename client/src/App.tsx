import React, { useState } from "react";
import { fetchFromAPI, HTTPMethods } from "./api";
import "react-json-pretty/themes/acai.css";
import ConsoleComponent from "./components/ConsoleComponent";
import InteractiveForm from "./components/InteractiveForm";
import DrawerContainer from "./components/DrawerContainer";

const App: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [json, setJson] = useState<string>("");
  const [url, setUrl] = useState<string>("/");

  const execute = async () => {
    setLoading(true);
    const response: ResponseMessage = await fetchFromAPI(url, HTTPMethods.GET);
    const pruned: string = pruneResponse(response);
    setLoaded(true);
    setLoading(false);
    setJson(pruned);
  };

  const updateUrl = (url: string) => {
    setUrl(url);
  };

  const pruneResponse = (response: ResponseMessage): string => {
    const { endpoint, message, size, status, data } = response;
    return JSON.stringify({
      endpoint,
      status,
      message,
      size,
      data: data ? data : null,
    });
  };

  return (
    <div className="App">
      <div className="flex-normal">
        <DrawerContainer execute={execute} updateUrl={updateUrl} />
        <ConsoleComponent
          json={json}
          loaded={loaded}
          loading={loading}
          display={`GET http://localhost:8000${url}`}
        />
      </div>
    </div>
  );
};

export default App;
