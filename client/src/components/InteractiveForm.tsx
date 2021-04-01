import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/Textfield";
import { Button } from "@material-ui/core";

type Props = {
  updateUrl: (url: string) => void;
  execute: () => void;
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
      display: "flex",
      flexDirection: "column",
    },
  },
}));

const InteractiveForm: React.FC<Props> = ({ updateUrl, execute }) => {
  const classes = useStyles();

  const endpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    updateUrl(event.target.value);
  };

  return (
    <div className="pad-margin-no-top">
      <h2>Interactive API</h2>
      <form
        id="interactive-form"
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <TextField
          defaultValue="/"
          id="Endpoint"
          label="Endpoint"
          variant="filled"
          color="primary"
          onChange={endpointChange}
          onKeyUp={(event) => {
            event.preventDefault();
            console.log(event);
            if (event.ctrlKey && event.key === "Enter") execute();
          }}
        />
        <Button color="default" variant="contained" onClick={execute}>
          Execute
        </Button>
      </form>
    </div>
  );
};

export default InteractiveForm;
