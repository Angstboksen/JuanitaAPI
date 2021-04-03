import express, { Request, Response } from "express";
import { SearchObject } from "../../types";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
  _fetchDBCollectionAppliedFilter,
} from "../firebase/logic";
import { validateLimit } from "../utils/helpers";
import { message } from "../utils/responses";

const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const path = "/searches";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const searches = validateLimit(
      await pruneSearches(await _fetchDBCollection("searches")),
      limit
    );
    if (searches === null) return response.json(message(path, 204));
    response.json(message(path, 200, searches));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/:userid").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const userid: string = request.params.userid;
  const path = `/searches/${userid}`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const searches = await _fetchDBCollectionAppliedFilter(
      "searches",
      "requestor.id",
      "=",
      userid
    );
    if (searches === null) return response.json(message(path, 204));
    response.json(
      message(path, 200, validateLimit(await pruneSearches(searches), limit))
    );
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/requestor").get(async (request: Request, response: Response) => {
  const name: string = request.query.name as string;
  const disc: string = request.query.disc as string;
  const limit = request.query.limit;
  const path = `/searches/requestor/?name=${name}&disc=${disc}`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  if (!name || !disc) return response.json(message(path, 400));
  const usertag = `${name}#${disc}`;
  try {
    const searches = await _fetchDBCollectionAppliedFilter(
      "searches",
      "requestor.tag",
      "=",
      usertag
    );
    if (searches === null) return response.json(message(path, 204));
    response.json(
      message(path, 200, validateLimit(await pruneSearches(searches), limit))
    );
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

export const pruneSearches = async (searches: any): Promise<SearchObject[]> => {
  for (const search of searches) {
    search.date = new Date(search.date).toString();
    delete search["song"];
  }
  return searches;
};

export default router;
