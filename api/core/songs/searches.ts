import express, { Request, Response } from "express";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import { message } from "../utils/responses";

const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const path = "/searches";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const searches = await _fetchDBCollection("searches");
    for (const search of searches) {
      search.date = new Date(search.date).toString()
      delete search["song"];
    }
    response.json(message(path, 200, searches));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

export default router;
