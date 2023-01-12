import { Router } from "express";
import {
  signUp,
  logIn,
  logOut,
  getProfile,
} from "../controllers/auth.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";

const router = Router();

router.post("");

export default router;
