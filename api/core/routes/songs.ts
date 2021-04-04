import express, { Request, Response } from "express";
import firestoreConnection from "../firebase/connection";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import { validateLimit } from "../utils/helpers";
import { message } from "../utils/responses";
const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const limit = request.query.limit;
  const path = "/songs";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  let songs;
  try {
    if (validateLimit(limit))
      songs = await _fetchDBCollection("songs", +limit!);
    else songs = await _fetchDBCollection("songs");
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
    const songs = await _fetchDBCollection("songs");

    // firestoreConnection
    //   .collection("songs")
    //   .get()
    //   .then((snap) => {
    //     const size = snap.size; // will return the collection size
    //     console.log(size);
    //   });

    const song = songs[Math.floor(Math.random() * songs.length)];
    response.json(message(path, 200, song));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});
export default router;
