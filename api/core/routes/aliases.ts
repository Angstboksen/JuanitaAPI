import express, { Request, Response } from "express";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import { validateLimit } from "../utils/helpers";
import { message } from "../utils/responses";
const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const path = "/aliases";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  let aliases;
  try {
    if (validateLimit(limit))
      aliases = await _fetchDBCollection("aliases", +limit!);
    else aliases = await _fetchDBCollection("aliases");
    for (const alias of aliases) {
      alias.spotify_url = `https://open.spotify.com/playlist/${alias.plid}`;
    }
    response.json(message(path, 200, aliases));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

export default router;
