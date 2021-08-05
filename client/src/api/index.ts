/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const baseURL = "http://localhost:8000";

export enum HTTPMethods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

export const fetchFromAPI = async (
  url: string,
  method: HTTPMethods,
  object: unknown = {}
): Promise<ResponseMessage> => {
  const URL = baseURL + url;
  const response = await fetch(URL, {
    method: method,
    mode: "cors",
    body: method === HTTPMethods.GET ? null : JSON.stringify(object),
  });
  const returnObj = {
    ...(await response
      .json()
      .catch((err) => console.log("An error occured: " + err))),
    endpoint: url,
  };
  return returnObj;
};
