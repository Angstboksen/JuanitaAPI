import express, { Request, Response } from "express";
import {
  _fetchDBCollection,
  _fetchDBCollectionWithDoc,
} from "../firebase/logic";
import { message } from "../utils/responses";
const router = express.Router();

router.route("/").get(async (request: Request, response: Response) => {
  const path = "/";
  console.log(`[Juanita]: Reached '${path}' endpoint from ${request.ip}`);
  try {
    const obj = {
      name: "JuanitaAPI",
      type: "REST",
      date: new Date().toString(),
      author: "Hauk Aleksander Olaussen",
      github_repository: "https://github.com/Angstboksen/JuanitaAPI",
      discord_bot: "https://github.com/Angstboksen/JuanitaMusic",
      invite_link:
        "https://discord.com/oauth2/authorize?client_id=708320525285457950&permissions=0&scope=bot",
    };
    response.json(message(path, 200, obj));
  } catch (error) {
    console.error(`[Juanita]: An error occured at '${path}': ${error}`);
    response.json(message(path, 500));
  }
});

export default router;
