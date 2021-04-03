import { CircularProgress } from "@material-ui/core";
import React from "react";
import JSONPretty from "react-json-pretty";

type Props = {
  json: ResponseMessage;
  display: string;
  statusColor: string;
  loaded: boolean;
  loading: boolean;
};

const ConsoleComponent: React.FC<Props> = ({
  json,
  display,
  statusColor,
  loaded,
  loading,
}) => {
  return (
    <div className="console">
      <h2>Juanita API console view</h2>
      {!loaded && <h4>Here is an example of the fetched data format</h4>}
      <pre className="text-center">{display}</pre>
      {loading ? (
        <>
          <pre>Loading data...</pre>
          <br />
          <CircularProgress />
        </>
      ) : (
        <>
          <pre className={`get ${statusColor}`}>{json.message}</pre>
          <JSONPretty className="json-pretty" data={json}></JSONPretty>
        </>
      )}
    </div>
  );
};

export default ConsoleComponent;
