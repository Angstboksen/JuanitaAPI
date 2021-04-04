import express, { Request, Response } from "express";
import { JuanitaStats, SearchObject, SearchRequestor, Song } from "../../types";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import { message } from "../utils/responses";
const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const path = `/stats`;
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const requestors = await _fetchDBCollection("requestors");
    const searches = await _fetchDBCollection("searches");
    const songs = await _fetchDBCollection("songs");
    const aliases = await _fetchDBCollection("aliases");
    const sotd = (await _fetchDBCollectionWithDoc("specials", "sotd")) as Song;
    const sotw = (await _fetchDBCollectionWithDoc("specials", "sotw")) as Song;
    const sotm = (await _fetchDBCollectionWithDoc("specials", "sotm")) as Song;

    const juanitaStatsObject: JuanitaStats = {
      song_amount: songs.length,
      search_amount: searches.length,
      requestor_amount: requestors.length,
      alias_amount: aliases.length,
      song_of_the_day: sotd,
      song_of_the_week: sotw,
      song_of_the_month: sotm,
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

export const secondsToTimestamp = (seconds: number): string => {
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  return `${d} days, ${h} hours, ${m} minutes, and ${s} seconds`;
};

export default router;
