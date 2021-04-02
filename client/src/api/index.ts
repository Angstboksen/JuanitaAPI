/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const baseURL = "http://85.167.24.231:8000";

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
    status: response.status,
  };
  return returnObj;
};
