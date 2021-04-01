import { json } from "body-parser";
import { Response } from "express";
import { ResponseMessage } from "../../types";

const ResponseMessages = new Map();
ResponseMessages.set(200, "200 OK");
ResponseMessages.set(400, "400 Bad Request");
ResponseMessages.set(404, "404 Not Found");
ResponseMessages.set(500, "500 Internal Server Error");

export const message = (
  endpoint: string,
  status: number,
  data?: any
): ResponseMessage => {
  return {
    endpoint,
    status,
    message: ResponseMessages.get(status),
    size: data ? data.length : 0,
    data,
  };
};
