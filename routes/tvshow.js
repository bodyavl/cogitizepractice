const express = require("express");
const router = express.Router();

const axios = require("axios").default;

const TVShow = require("../database/schemes/tvshow");

const { shuffle } = require("../shuffle");

const genresList = {
  Any: null,
  Action: "Action",
  Horror: "Horror",
  Drama: "Drama",
  Comedy: "Comedy",
};

router.get("/list", async (req, res, next) => {
  try {
    const { genre } = req.query;

    const options = {};

    if (genre && genresList[genre])
      options.genres = { $elemMatch: { name: genresList[genre] } };

    const TVShows = await TVShow.find(options).select(
      "_id title poster rating genres"
    );
    const shuffledTVShows = shuffle(TVShows);
    if (!shuffledTVShows) throw new Error("No TVShows found");

    res.status(200).json(shuffledTVShows.slice(0, 8));
  } catch (error) {
    next(error);
  }
});

// Delete all TVShow-notes in the linked DB
router.get("/cleanDB", async (req, res, next) => {
  try {
    const TVShowsList = await TVShow.find({});
    for (let TVShow of TVShowsList) {
      await TVShow.findByIdAndDelete(TVShow._id);
    }
    res.sendStatus(200);
    console.log("DB of TVShows has been cleaned. It's empty!");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const movie = await TVShow.findById(id).select("-__v -_id");
  
      if (movie) res.status(200).json(movie);
      else throw new Error("TVShow has not found");
    } catch (error) {
      next(error);
    }
  });

router.post("/create", async (req, res, next) => {
  try {
    const newTVShow = await TVShow.create({
      title: req.body.title,
      description: req.body.description,
      genres: req.body.genres,
      tagline: req.body.tagline,
      poster: req.body.poster,
      backdrop: req.body.backdrop,
      date: req.body.date,
      rating: req.body.rating,
      runtime: req.body.runtime,
    });
    //console.log("TVShow has been created: ", newTVShow);
    res.json(newTVShow);
  } catch (error) {
    next(error);
  }
});

router.get("/TMDB/fill", async (req, res, next) => {
  try {
    setTimeout(addTVShowsToDB, FETCHINGDELAY, 1);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// Fill the DB with TVShows
const FETCHINGDELAY = 5000;
const iterationCount = 50;
async function addTVShowsToDB(pageIteration = 1) {
  if (pageIteration > 1000) return;
  for (let i = pageIteration; i < pageIteration + iterationCount; i++) {
    const TVShowsRaw = await axios.get(
      "https://api.themoviedb.org/3/discover/tv",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: "18|27|28|35",
          page: i,
        },
      }
    );
    let TVShowsIDs = [];
    TVShowsRaw.data.results.forEach((element) => {
      TVShowsIDs.push(element.id);
    });
    for (let TVShowId of TVShowsIDs) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${TVShowId}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
            },
          }
        );
        const {
          id,
          name,
          poster_path,
          backdrop_path,
          vote_average,
          genres,
          runtime,
          tagline,
          overview,
          release_date,
        } = response.data;
        if (overview) {
          const newTVShow = await TVShow.create({
            id,
            title: name,
            tagline,
            description: overview,
            poster: `https://image.tmdb.org/t/p/original${poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
            rating: vote_average,
            runtime,
            genres,
            date: release_date,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  setTimeout(addTVShowsToDB, FETCHINGDELAY, pageIteration + iterationCount);
}

module.exports = router;
