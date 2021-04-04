import React, { useState } from "react";
import { baseURL, fetchFromAPI, HTTPMethods } from "./api";
import "react-json-pretty/themes/acai.css";
import ConsoleComponent from "./components/ConsoleComponent";
import DrawerContainer from "./components/DrawerContainer";

const App: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [json, setJson] = useState<ResponseMessage>(exampleDisplay);
  const [statusColor, setStatusColor] = useState<string>("green");
  const [url, setUrl] = useState<string>("/");

  const execute = async () => {
    setLoading(true);
    const response: ResponseMessage = await fetchFromAPI(url, HTTPMethods.GET);
    const pruned = pruneResponse(response);
    setLoaded(true);
    setLoading(false);
    getStatusColor(pruned);
    setJson(pruned);
  };

  const getStatusColor = (res: ResponseMessage) => {
    let color;
    switch (res.status) {
      case 200:
        color = "green";
        break;
      case 204:
        color = "orange";
        break;
      case 400:
        color = "red";
        break;
      case 404:
        color = "red";
        break;
      case 500:
        color = "red";
        break;
      default:
        color = "green";
    }
    setStatusColor(color);
  };

  const updateUrl = async (base: string, limit: string = "?limit=50") => {
    const nUrl = `${base}${limit}`;
    setUrl(nUrl);
  };

  const pruneResponse = (response: ResponseMessage): ResponseMessage => {
    const { endpoint, message, size, status, data } = response;
    return {
      endpoint,
      status,
      message,
      size,
      data: data ? data : null,
    };
  };

  return (
    <div className="App">
      <div className="flex-normal">
        <DrawerContainer execute={execute} updateUrl={updateUrl} url={url} />
        <ConsoleComponent
          json={json}
          loaded={loaded}
          statusColor={statusColor}
          loading={loading}
          display={`GET\n ${baseURL}${url}`}
        />
      </div>
    </div>
  );
};

const exampleDisplay: ResponseMessage = {
  endpoint: "/",
  status: 200,
  message: "200 OK",
  size: 1,
  data: "{...}",
};

export default App;
