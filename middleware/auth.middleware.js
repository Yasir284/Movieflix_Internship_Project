import asyncHandler from "../services/asyncHandler.js";
import User from "../models/user.schema.js";
import JWT from "jsonwebtoken";
import CustomeError from "../utils/customeError.js";
import config from "../config/config.js";

// Middleware to check if user is loggedin
export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  const bearerToken = req.header("Authorization")
    ? req.header("Authorization").replace("Bearer ", "")
    : null;

  const token = req.cookies.token || bearerToken;

  if (!token) {
    throw new CustomeError("Not authorized to access the route");
  }

  try {
    const decodeToken = JWT.verify(token, config.JWT_SECRET);
    req.user = await User.findById(decodeToken._id, "name email role");

    next();
  } catch (err) {
    console.log(err);
    throw new CustomeError("Not authorized to access the route", 400);
  }
});

// Middleware to give access to routes based on roles
export const authRole = (role) => {
  return asyncHandler(async (req, _res, next) => {
    if (req.user.role !== role) {
      throw new CustomeError(
        "You don't have permission to access this route",
        401
      );
    }
    next();
  });
};
