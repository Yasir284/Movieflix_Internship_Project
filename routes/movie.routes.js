import { Router } from "express";
import {
  getMovies,
  addMovie,
  updateMovie,
} from "../controllers/movie.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";

const router = Router();

// Routes
router.get("/get", getMovies);
router.post("/add", addMovie);
router.put("/update", updateMovie);

export default router;
