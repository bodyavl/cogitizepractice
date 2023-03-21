const Movie = require('./db/models/movie');
async function getRandomMovies(options, limit = 8){
  return await Movie.aggregate([{ $match: { ...options } }, { $sample: { size: limit } }, { $project: { type: 1, title: 1, poster: 1, rating: 1, genres: 1 }  }]);
}
// .select("_id type title poster rating genres")
module.exports = {
  getRandomMovies
};
