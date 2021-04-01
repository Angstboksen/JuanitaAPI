import express from "express";

// --- SONG ---
import readSongs from "./routes/songs";
import readSearches from "./routes/searches";
import readRequestors from "./routes/requestors";
import readAliases from "./routes/aliases";
import stats from "./routes/stats";
import home from "./routes/home";
const router = express.Router();

router.use("/", home);
router.use("/stats", stats);
router.use("/songs", readSongs);
router.use("/searches", readSearches);
router.use("/requestors", readRequestors);
router.use("/aliases", readAliases);
export default router;
