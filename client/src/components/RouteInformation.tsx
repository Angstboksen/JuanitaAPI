import React from "react";
import { RouteEnum, routesMap } from "./RoutesArray";

type Props = {
  route: MiniRoute;
};

const RouteInformation: React.FC<Props> = ({ route }) => {
  const display = routesMap.get(route.enum);
  const initialRoute = routesMap.get(RouteEnum.INITIAL);
  return (
    <div className="route-information">
      <div>{display ? display.description : initialRoute?.description}</div>
    </div>
  );
};

export default RouteInformation;
