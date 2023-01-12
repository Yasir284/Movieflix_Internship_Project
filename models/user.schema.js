import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import config from "../config/config.js";
import AuthRoles from "../utils/authRole.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validateEmail, "Enter valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      maxLength: [8, "Password must be more than 8 characters"],
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
  },
  {
    timestamps: true,
  }
);

// Email validation function
function validateEmail(email) {
  let emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return emailRegex.test(email);
}

// Encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// Schema methods
userSchema.methods = {
  comparePassword: async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
  },

  getJwtToken: function () {
    const payload = { _id: this._id, role: this.role };

    return JWT.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRY,
    });
  },
};

export default mongoose.model("User", userSchema);
