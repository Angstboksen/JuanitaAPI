import { CircularProgress, LinearProgress } from "@material-ui/core";
import React from "react";
import JSONPretty from "react-json-pretty";

type Props = {
  json: string;
  display: string;
  loaded: boolean;
  loading: boolean;
};

const ConsoleComponent: React.FC<Props> = ({
  json,
  display,
  loaded,
  loading,
}) => {
  return (
    <div className="console pad-margin">
      <pre>{loaded ? display : defaultDisplay}</pre>
      {loading ? (
        <>
          <code>Loading data...</code>
          <br />
          <CircularProgress />
        </>
      ) : (
        <>
          <JSONPretty className="json-pretty" data={json}></JSONPretty>
        </>
      )}
    </div>
  );
};

const defaultDisplay =
  "Use the interactive API to display data in the console field";

export default ConsoleComponent;
