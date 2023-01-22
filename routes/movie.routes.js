import { Router } from "express";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  addWishlist,
  removeWishlist,
  searchMovie,
} from "../controllers/movie.controller.js";
import { isLoggedIn, authRole } from "../middleware/auth.middleware.js";
import AuthRoles from "../utils/authRole.js";

const router = Router();

// Routes
router.post("/get", isLoggedIn, getMovies);
router.post("/add", isLoggedIn, authRole(AuthRoles.ADMIN), addMovie);
router.put(
  "/update/:movieId",
  isLoggedIn,
  authRole(AuthRoles.ADMIN),
  updateMovie
);
router.put(
  "/delete/:movieId",
  isLoggedIn,
  authRole(AuthRoles.ADMIN),
  deleteMovie
);
router.put("/update/add_wishlist/:movieId", isLoggedIn, addWishlist);
router.put("/update/remove_wishlist/:movieId", isLoggedIn, removeWishlist);
router.post("/search/:key", isLoggedIn, searchMovie);

export default router;
