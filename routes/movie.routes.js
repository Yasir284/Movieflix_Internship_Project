import { Router } from "express";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  addWishlist,
  removeWishlist,
} from "../controllers/movie.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";

const router = Router();

// Routes
router.get("/get", isLoggedIn, getMovies);
router.post("/add", isLoggedIn, addMovie);
router.put("/update/:movieId", isLoggedIn, updateMovie);
router.delete("/delete/:movieId", isLoggedIn, deleteMovie);
router.put("/update/add_wishlist/:movieId", isLoggedIn, addWishlist);
router.put("/update/remove_wishlist/:movieId", isLoggedIn, removeWishlist);

export default router;
