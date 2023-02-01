import asyncHandler from "../services/asyncHandler.js";
import CustomeError from "../utils/customeError.js";
import Movie from "../models/movie.schema.js";
import cloudinary from "cloudinary";
import config from "../config/config.js";

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

/**********************************************************************
 @GET_MOVIES
 @request_type POST
 @route http://localhost:4000/api/movie/get
 @description Getting movies based on categories
 @parameters array of categories from req.body 
 @return Movies object
 **********************************************************************/

export const getMovies = asyncHandler(async (req, res) => {
  const categories = req.body?.categories || undefined;
  console.log(categories);
  let getMovies;

  if (!categories || categories.length === 0) {
    getMovies = await Movie.find();
  } else {
    getMovies = await Movie.find({ category: { $in: categories } });
  }

  if (!getMovies) throw new CustomeError("Movies not found", 400);

  res.status(200).json({ success: true, movies: getMovies });
});

/**********************************************************************
 @ADD_MOVIE
 @request_type POST
 @route http://localhost:4000/api/movie/add
 @description Adding movie in database
 @parameters  category, name, rating, trailerUrl, streamingPlatform, description
 @return Movie object
 **********************************************************************/

export const addMovie = asyncHandler(async (req, res) => {
  const { category, name, rating, trailerUrl, streamingPlatform, description } =
    req.body;
  const file = req.files.movieImage;
  console.log(file);
  let result;
  let image;

  if (!(category && name && rating && streamingPlatform && description)) {
    throw new CustomeError("Enter required fields", 400);
  }

  const isMovieAdded = await Movie.findOne({ name });

  if (isMovieAdded) {
    throw new CustomeError("This movie already added", 400);
  }

  if (file) {
    result = await cloudinaryV2.uploader.upload(file.tempFilePath, {
      folder: config.CLOUDINARY_FOLDER_NAME,
    });

    image = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const payload = {
    category,
    name,
    rating,
    image,
    trailerUrl,
    streamingPlatform,
    description,
  };

  try {
    const movie = await Movie.create(payload);
    res.status(200).json({
      success: true,
      message: "New movie added",
      movie,
    });
  } catch (err) {
    console.log(err);
    await cloudinaryV2.uploader.destroy(image.public_id);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**********************************************************************
 @UPDATE_MOVIE
 @request_type PUT
 @route http://localhost:4000/api/movie/update/:movieId
 @description Updating movie in database
 @parameters any of category, name, rating, image, trailerUrl, streamingPlatform, description
 @return Movie object
 **********************************************************************/

export const updateMovie = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { movieId } = req.params;
  console.log(req.files);
  const file = req.files ? req.files?.movieImage : null;
  let result;

  if (file) {
    result = await cloudinaryV2.uploader.upload(file.tempFilePath, {
      public_id: payload.public_id,
    });

    const image = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };

    payload.image = image;
  }
  console.log(result);

  const movie = await Movie.findByIdAndUpdate(movieId, payload, { new: true });

  console.log(movie);

  res.status(200).json({ success: true, message: "Movie updated", movie });
});

/**********************************************************************
 @DELETE_MOVIE
 @request_type PUT
 @route http://localhost:4000/api/movie/delete/:movieId
 @description Delete movie from database
 @parameters
 @return Success message
 **********************************************************************/

export const deleteMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { public_id } = req.body;
  if (!(movieId && public_id))
    throw new CustomeError("Something went wrong", 400);

  const result = await cloudinaryV2.uploader.destroy(public_id);

  const deleteMovie = await Movie.findByIdAndDelete(movieId);

  res
    .status(200)
    .json({ success: true, message: "Movie deleted successfully" });
});

/**********************************************************************
 @ADD_WISHLIST
 @request_type PUT
 @route http://localhost:4000/api/movie/update/add_wishlist/:movieId
 @description Adding userId in movie wishlist array
 @parameters movieId and userId
 @return Success message and movie object
 **********************************************************************/

export const addWishlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { userId } = req.body;

  const updateWishlist = await Movie.findByIdAndUpdate(
    { _id: movieId },
    {
      $push: { wishlist: { userId } },
    },
    {
      new: "true",
    }
  );
  console.log(updateWishlist);

  res.status(200).json({
    success: true,
    message: "Whishlist updated",
    movie: updateWishlist,
  });
});

/**********************************************************************
 @REMOVE_WISHLIST
 @request_type PUT
 @route http://localhost:4000/api/movie/update/remove_wishlist/:movieId
 @description Removing userId from movie wishlist array
 @parameters movieId and userId
 @return Success message and movie object
 **********************************************************************/

export const removeWishlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { userId } = req.body;

  const movie = await Movie.findById({ _id: movieId });

  const updateWishlist = movie.wishlist.filter((e) => e.userId !== userId);
  console.log(updateWishlist);

  const updateMovie = await Movie.findByIdAndUpdate(
    movieId,
    { wishlist: updateWishlist },
    { new: true }
  );
  console.log(updateMovie);

  res
    .status(200)
    .json({ success: true, message: "Whishlist updated", movie: updateMovie });
});

/**********************************************************************
 @SEARCH_MOVIE
 @request_type POST
 @route http://localhost:4000/api/movie/search
 @description Searching movie based on movie name and categories
 @parameters search
 @return Movie object
 **********************************************************************/

export const searchMovie = asyncHandler(async (req, res) => {
  const search = req.params.key;
  const categories = req.body.categories;
  console.log(categories);
  let searchMovie;

  if (categories.length === 0 && search) {
    searchMovie = await Movie.find({
      $or: [{ name: { $regex: search, $options: "i" } }],
    });
  } else {
    searchMovie = await Movie.find({
      $and: [
        { name: { $regex: search, $options: "i" } },
        { category: { $in: categories } },
      ],
    });
  }
  console.log(searchMovie);
  if (!searchMovie || searchMovie.length === 0)
    throw new CustomeError("Movie not found", 400);

  res.status(200).json({ success: true, movies: searchMovie });
});
