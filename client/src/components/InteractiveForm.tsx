import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/Textfield";
import { Button } from "@material-ui/core";
import { RouteEnum, routesMap } from "./RoutesArray";

type Props = {
  updateUrl: (url: string, limit?: string) => void;
  execute: () => void;
  url: string;
  route: MiniRoute;
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

const InteractiveForm: React.FC<Props> = ({
  updateUrl,
  execute,
  url,
  route,
}) => {
  const classes = useStyles();
  const readOnly = route.enum !== RouteEnum.INITIAL;
  const routeObj = routesMap.get(route.enum)!;
  const [limit, setLimit] = useState<number>(50);
  const [discord, setDiscord] = useState<string>("");

  const endpointChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    updateUrl(event.target.value);
  };

  const discordIDChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setDiscord(value);
    const nUrl = routeObj.base.replace("<discord_id: string>", value);
    updateUrl(nUrl, `?limit=${limit}`);
  };

  const limitChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let l: number;
    if (!Number.isNaN(+value)) {
      l = +value;
    } else {
      l = 20;
    }
    setLimit(l);
    const nUrl = routeObj.base.replace("<discord_id: string>", discord);
    updateUrl(nUrl, `?limit=${l}`);
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setLimit(50);
    setDiscord("");
    execute();
  };

  const userSpesific =
    route.enum === RouteEnum.SEARCHES_USER ||
    route.enum === RouteEnum.REQUESTORS_TOPSONGS ||
    route.enum === RouteEnum.REQUESTORS_TOPSONG;
  const { isArray } = routesMap.get(route.enum)!;

  return (
    <div className="pad-margin-no-top interactiveform">
      <h3>Send a request</h3>
      <form
        id="interactive-form"
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="Endpoint"
          label="Endpoint"
          variant="filled"
          color="primary"
          value={url}
          disabled={readOnly}
          onChange={endpointChange}
        />
        {userSpesific && (
          <TextField
            value={discord}
            id="DiscordID"
            label="Discord ID"
            variant="filled"
            color="primary"
            onChange={discordIDChange}
          />
        )}
        {isArray && (
          <TextField
            value={limit}
            id="Limit"
            label="Limit"
            variant="filled"
            color="primary"
            onChange={limitChange}
          />
        )}
        <Button color="default" variant="contained" type="submit">
          Execute
        </Button>
      </form>
    </div>
  );
};

export default InteractiveForm;
