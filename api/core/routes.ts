import express from "express";

// --- SONG ---
import readSongs from "./songs/songs";
import readSearches from "./songs/searches";
const router = express.Router();

router.use("/songs", readSongs);
router.use("/searches", readSearches);

export default router;
