import { Router } from "express";
import {
  signUp,
  logIn,
  logOut,
  getProfile,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/logout", logOut);
router.get("/profile", isLoggedIn, getProfile);

export default router;
