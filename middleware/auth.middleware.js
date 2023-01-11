import asyncHandler from "../../../E-commerce project/services/asyncHandler";
import User from "../models/user.schema";
import JWT from "jsonwebtoken";
import config from "../../../E-commerce project/config";

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const bearerToken = req.header("Authorization")
    ? req.header("Authorization").replace("Bearer ", "")
    : null;
  let token;

  if (req.cookie.token || bearerToken) {
    token = res.cookie.token || bearerToken;
  }

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

export default isLoggedIn;
