import express, { Request, Response } from "express";
import { JuanitaStats, SearchObject, SearchRequestor, Song } from "../../types";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import { message } from "../utils/responses";
import { findRequestorPlays } from "./requestors";
import moment from "moment";
const router = express.Router();

router.route("/").get(async (_request: Request, response: Response) => {
  const path = `/stats`;
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

export const secondsToTimestamp = (seconds: number): string => {
  if (seconds < 3600) {
    return moment().startOf("day").seconds(seconds).format("mm:ss");
  }
  return moment().startOf("day").seconds(seconds).format("HH:mm:ss");
};

export default router;
