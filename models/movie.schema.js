import mongoose from "mongoose";
import MovieCategories from "../utils/movieCategory";

const wishlist = mongoose.Schema({ userId: { type: String, unique: true } });

const movieSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: Object.values(MovieCategories),
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less than 50 characters"],
    },
    description: String,
    rating: Number,
    imageUrl: String,
    trailerUrl: String,
    streamingPlatform: String,
    wishlist: [wishlist],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Movie", movieSchema);
