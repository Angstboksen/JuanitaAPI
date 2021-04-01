import express, { NextFunction, Request, Response } from "express";
import { urlencoded, json } from "body-parser";
import cors from "cors";
import routes from "./core/routes";
import { message } from "./core/utils/responses";

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use((req: any, res: any, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept"
  );
  next();
});

app.set("json spaces", 4);

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Home endpoint");
});

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.log("An error has occurred:", error);
    next(error);
  }
);

app.get("*", function (req, res) {
  res.status(404).send(message("*", 404));
});

const port = 8000;
const host = "localhost";
app.listen(port, host, () => {
  console.log(`[Juanita]: Serves is listening at http://${host}:${port}`);
});
