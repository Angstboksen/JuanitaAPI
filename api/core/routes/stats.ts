import express, { Request, Response } from "express";
import axios from "axios";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import {
  _fetchMongoCollection,
  _fetchMongoCollectionLength,
  _fetchMongoSearchesOfRequestor,
} from "../mongodb/logic";
import { message } from "../utils/responses";
const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const path = `/stats`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const playtime = await _fetchDBCollectionWithDoc("specials", "playtime");
    const unique_songs = await _fetchMongoCollectionLength("songs");
    const total_plays = await _fetchMongoCollectionLength("searches");
    const unique_requestors = await _fetchMongoCollectionLength("requestors");
    const top_requestor = (
      await axios.get("https://juanitaapi.herokuapp.com/requestors/top")
    ).data.data[0];
    const time_played = {
      seconds: playtime!.seconds,
      readable: secondsToTimestamp(playtime!.seconds),
    };
    const sotd = (await _fetchDBCollectionWithDoc("specials", "sotd"))!.title;
    const sotw = (await _fetchDBCollectionWithDoc("specials", "sotw"))!.title;
    const sotm = (await _fetchDBCollectionWithDoc("specials", "sotm"))!.title;

    const juanitaStatsObject = {
      unique_songs,
      total_plays,
      unique_requestors,
      top_requestor: { tag: top_requestor.tag, plays: top_requestor.plays },
      time_played,
      sotd,
      sotw,
      sotm,
    };
    response.json(message(path, 200, juanitaStatsObject));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/playtime").get(async (request: Request, response: Response) => {
  const path = `/stats/playtime`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const playtime = await _fetchDBCollectionWithDoc("specials", "playtime");
    const converted = {
      seconds: playtime!.seconds,
      readable: secondsToTimestamp(playtime!.seconds),
    };
    response.json(message(path, 200, converted));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

router.route("/test").get(async (request: Request, response: Response) => {
  const path = `/stats/test`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const searches = await _fetchMongoCollection("searches");
    response.json(message(path, 200, searches.length));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

export const secondsToTimestamp = (seconds: number): string => {
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  return `${d} days, ${h} hours, ${m} minutes, and ${s} seconds`;
};

export default router;
