import express, { Request, Response } from "express";
import { SearchObject, SearchRequestor } from "../../types";
import {
  _fetchDBCollection,
  _fetchDBCollectionAndSort,
  _fetchDBCollectionAppliedFilter,
} from "../firebase/logic";
import { validateLimit } from "../utils/helpers";
import { message } from "../utils/responses";
import { pruneSearches } from "./searches";
const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const path = `/requestors`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  let requestors;
  try {
    if (validateLimit(limit))
      requestors = await _fetchDBCollection("requestors", +limit!);
    else requestors = await _fetchDBCollection("requestors");
    response.json(message(path, 200, requestors));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router
  .route("/:userid/topsong")
  .get(async (request: Request, response: Response) => {
    const userid: string = request.params.userid;
    const path = `/requestors/${userid}/topsong`;
    try {
      const searches = await _fetchDBCollectionAppliedFilter(
        "searches",
        "requestor.id",
        "=",
        userid
      );
      if (searches === null) return response.json(message(path, 204));

      const sorted = findTopSongs(await pruneSearches(searches));
      response.json(message(path, 200, sorted[0]));
    } catch (error) {
      console.error(`[Juanita]: An error occured at '${path}': ${error}`);
      response.json(message(path, 500));
    }
  });

router
  .route("/:userid/topsongs")
  .get(async (request: Request, response: Response) => {
    const limit = request.query.limit;
    const userid: string = request.params.userid;
    const path = `/requestors/${userid}/topsongs`;
    console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
    try {
      const searches = await _fetchDBCollectionAppliedFilter(
        "searches",
        "requestor.id",
        "=",
        userid
      );
      if (searches === null) return response.json(message(path, 204));
      let sorted;
      if (validateLimit(limit) && +limit! > 0 && +limit! < 10)
        sorted = findTopSongs(await pruneSearches(searches)).slice(0, +limit!);
      else sorted = findTopSongs(await pruneSearches(searches)).slice(0, 10);

      response.json(message(path, 200, sorted));
    } catch (error) {
      console.error(`[Juanita]: An error occured at '${path}': ${error}`);
      response.json(message(path, 500));
    }
  });

router.route("/top").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const path = `/requestors/top`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    let requestors;
    if (validateLimit(limit) && +limit! > 0 && +limit! < 10)
      requestors = await _fetchDBCollectionAndSort(
        "requestors",
        "plays",
        "desc",
        +limit!
      );
    else
      requestors = await _fetchDBCollectionAndSort(
        "requestors",
        "plays",
        "desc",
        10
      );
    response.json(message(path, 200, requestors));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

export const findRequestorPlays = async (searches: SearchObject[]) => {
  const requestors: SearchRequestor[] = await _fetchDBCollection("requestors");
  for (const requestor of requestors) {
    const amount = searches.filter(
      (search: SearchObject) => requestor.id === search.requestor.id
    ).length;
    requestor.plays = amount;
  }
  return requestors.sort(
    (a: SearchRequestor, b: SearchRequestor) => b.plays! - a.plays!
  );
};

export const findTopSongs = (searches: SearchObject[]) => {
  const container: string[] = [];
  const sorted: SearchObject[] = [];
  for (const search of searches) {
    if (container.includes(search.title)) {
      const found = sorted.find(
        (song: SearchObject) => song.title === search.title
      )!;
      if (new Date(search.date) > new Date(found.date))
        found.date = search.date;
      found.plays!++;
    } else {
      container.push(search.title);
      search.plays = 1;
      sorted.push(search);
    }
  }
  return sorted.sort((a: SearchObject, b: SearchObject) => b.plays! - a.plays!);
};

export default router;
