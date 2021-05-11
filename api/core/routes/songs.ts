import express, { Request, Response } from "express";
import { SearchObject } from "../../types";
import firestoreConnection from "../firebase/connection";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import {
  _fetchMongoCollection,
  _fetchMongoRandomDocument,
} from "../mongodb/logic";
import { validateLimit } from "../utils/helpers";
import { message } from "../utils/responses";
import { findTopSongs } from "./requestors";
import { pruneSearches } from "./searches";
const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const path = "/songs";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  let songs;
  try {
    if (validateLimit(limit))
      songs = await _fetchMongoCollection("songs", +limit!);
    else songs = await _fetchMongoCollection("songs");
    response.json(message(path, 200, songs));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/sotd").get(async (request: Request, response: Response) => {
  const path = "/songs/sotd";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const song = await _fetchDBCollectionWithDoc("specials", "sotd");
    response.json(message(path, 200, song));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/sotw").get(async (request: Request, response: Response) => {
  const path = "/songs/sotw";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const song = await _fetchDBCollectionWithDoc("specials", "sotw");
    response.json(message(path, 200, song));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/sotm").get(async (request: Request, response: Response) => {
  const path = "/songs/sotm";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const song = await _fetchDBCollectionWithDoc("specials", "sotm");
    response.json(message(path, 200, song));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/random").get(async (request: Request, response: Response) => {
  const path = "/songs/random";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const song = await _fetchMongoRandomDocument("songs");

    response.json(message(path, 200, song));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/top").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const path = "/songs/top";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const songs = await _fetchMongoCollection("searches");
    let top;
    if (validateLimit(limit))
      top = await pruneTopSongs(findTopSongs(songs).slice(0, +limit!));
    else top = await pruneTopSongs(findTopSongs(songs));
    response.json(message(path, 200, top));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

export const pruneTopSongs = async (searches: any): Promise<SearchObject[]> => {
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
    delete search["requestor"];
  }
  return searches;
};

export default router;
