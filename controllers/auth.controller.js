import asyncHandler from "../services/asyncHandler.js";
import CustomeError from "../utils/customeError.js";
import User from "../models/user.schema.js";

const cookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/**********************************************************************
 @SIGNUP
 @request_type POST
 @route http://localhost:4000/api/auth/signup
 @description User signup controller for new user
 @parameters name, email, password
 @return User object
 **********************************************************************/

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    throw new CustomeError("All fields are mandatory", 400);
  }

  const isEmailExists = await User.findOne({ email });

  if (isEmailExists) {
    throw new CustomeError("User exists with this email", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({ success: true, token, user });
});

/**********************************************************************
 @LOGIN
 @request_type POST
 @route http://localhost:4000/api/auth/login
 @description User login controller
 @parameters name, email
 @return User object
 **********************************************************************/

export const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password))
    throw new CustomeError("All fields are mandatory", 400);

  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!user) throw new CustomeError("Invalid credentials", 400);

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) throw new CustomeError("Invalid credentials", 400);

  const token = user.getJwtToken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({ success: true, token, user });
});

/**********************************************************************
 @LOGOUT
 @request_type GET
 @route http://localhost:4000/api/auth/logout
 @description User logout by clearing cookie
 @parameters 
 @return Success message
 **********************************************************************/

export const logOut = asyncHandler(async (_req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

/**********************************************************************
 @GET_PROFILE
 @request_type GET
 @route http://localhost:4000/api/auth/profile
 @description Getting user information form req.user
 @parameters 
 @return User object
 **********************************************************************/

export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new CustomeError("User not found", 400);
  }

  res.status(200).json({ success: true, user });
});
