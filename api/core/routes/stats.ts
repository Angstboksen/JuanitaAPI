import express, { Request, Response } from "express";
import { JuanitaStats, SearchObject, SearchRequestor, Song } from "../../types";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import {
  _fetchMongoCollection,
  _fetchMongoSearchesOfRequestor,
} from "../mongodb/logic";
import { message } from "../utils/responses";
const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const path = `/stats`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const playtime = await _fetchDBCollectionWithDoc("specials", "playtime");

    const juanitaStatsObject = {
      playtime: {
        seconds: playtime!.seconds,
        readable: secondsToTimestamp(playtime!.seconds),
      },
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
    const data = await _fetchMongoSearchesOfRequestor("192586347972788224", 10);
    if (data.length > 0) response.json(message(path, 200, data));
    else response.json(message(path, 204));
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
