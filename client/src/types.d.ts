type ResponseMessage = {
  endpoint: string;
  status: number;
  message: string;
  size?: number;
  data?: any;
};

type Route = {
  name: string;
  base: string;
  description: JSX.Element;
  isArray: boolean;
};

type MiniRoute = {
  route: string;
  enum: RouteEnum;
};
