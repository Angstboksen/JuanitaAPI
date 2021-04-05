import express, { Request, Response } from "express";
import { SearchObject } from "../../types";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
  _fetchDBCollectionAppliedFilter,
  _fetchDBCollectionAppliedFilterAndSort,
  _fetchDBCollectionAndSort,
  _inceptionCollection,
  _inceptionCollectionAndSort,
} from "../firebase/logic";
import { validateLimit } from "../utils/helpers";
import { message } from "../utils/responses";

const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const path = "/searches";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  let searches;
  try {
    if (validateLimit(limit))
      searches = await pruneSearches(
        await _fetchDBCollectionAndSort("searches", "date", "desc", +limit!)
      );
    else
      searches = await pruneSearches(
        await _fetchDBCollectionAndSort("searches", "date", "desc")
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
  let searches;
  try {
    if (validateLimit(limit))
      searches = await _inceptionCollectionAndSort(
        "requestors",
        userid,
        "searches",
        "date",
        "desc",
        +limit!
      );
    else
      searches = searches = await _inceptionCollectionAndSort(
        "requestors",
        userid,
        "searches",
        "date",
        "desc"
      );
    if (searches.length === 0) return response.json(message(path, 204));
    response.json(message(path, 200, await pruneSearches(searches)));
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
