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
  const onSubmit = (event: any) => {
    event.preventDefault()
    execute()
  }

  return (
    <div className="pad-margin-no-top interactiveform">
      <form
        id="interactive-form"
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          defaultValue="/"
          id="Endpoint"
          label="Endpoint"
          variant="filled"
          color="primary"
          onChange={endpointChange}

        />
        <Button color="default" variant="contained" type="submit">
          Execute
        </Button>
      </form>
    </div>
  );
};

export default InteractiveForm;
