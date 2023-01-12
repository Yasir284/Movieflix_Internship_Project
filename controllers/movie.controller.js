import asyncHandler from "../services/asyncHandler.js";
import CustomeError from "../utils/customeError.js";
import Movie from "../models/movie.schema.js";

/**********************************************************************
 @GET_MOVIES
 @request_type GET
 @route http://localhost:4000/api/movie/get
 @description Getting movies based on catagories
 @parameters 
 @return User object
 **********************************************************************/

export const getMovies = asyncHandler(async (req, res) => {});

/**********************************************************************
 @ADD_MOVIE
 @request_type POST
 @route http://localhost:4000/api/movie/add
 @description Adding movie in database
 @parameters  category, name, rating, imageUrl, trailerUrl, streamingPlatform, description
 @return Movie object
 **********************************************************************/

export const addMovie = asyncHandler(async (req, res) => {
  const {
    category,
    name,
    rating,
    imageUrl,
    trailerUrl,
    streamingPlatform,
    description,
  } = req.body;

  if (!(category && name && rating && streamingPlatform && description)) {
    throw new CustomeError("Enter required fields", 400);
  }

  const isMovieAdded = await Movie.find({ name });

  if (isMovieAdded) {
    throw new CustomeError("This movie already added", 400);
  }

  const payload = {
    category,
    name,
    rating,
    imageUrl,
    trailerUrl,
    streamingPlatform,
    description,
  };

  const movie = await Movie.create(payload);

  res.status(200).json({
    success: true,
    message: "New movie added",
    movie,
  });
});

/**********************************************************************
 @UPDATE_MOVIE
 @request_type POST
 @route http://localhost:4000/api/movie/update/:movieId
 @description Adding movie in database
 @parameters category, name, rating, imageUrl, trailerUrl, streamingPlatform, description
 @return Movie object
 **********************************************************************/

export const updateMovie = asyncHandler(async (req, res) => {
  const {
    category,
    name,
    rating,
    imageUrl,
    trailerUrl,
    streamingPlatform,
    description,
  } = req.body;

  const { id: movieId } = req.params;
});
