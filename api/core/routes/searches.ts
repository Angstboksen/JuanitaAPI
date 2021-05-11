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
import {
  _fetchMongoCollectionAndSortDate,
  _fetchMongoSearchesOfRequestor,
} from "../mongodb/logic";
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
      searches = pruneSearches(
        await _fetchMongoCollectionAndSortDate("searches", +limit!)
      );
    else
      searches = pruneSearches(
        await _fetchMongoCollectionAndSortDate("searches")
      );

    if (searches.length > 0) response.json(message(path, 200, searches));
    else response.json(message(path, 204));
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
      searches = await _fetchMongoSearchesOfRequestor(userid, +limit!);
    else searches = searches = await _fetchMongoSearchesOfRequestor(userid);
    if (searches.length > 0)
      response.json(message(path, 200, pruneSearches(searches)));
    else response.json(message(path, 204));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

export const pruneSearches = (searches: SearchObject[]): SearchObject[] => {
  for (const search of searches) {
    search.date = new Date(search.date).toLocaleString("no-NO", {
      timeZone: "Europe/Oslo",
      hour12: false,
      formatMatcher: "basic",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }
  return searches;
};

export default router;
