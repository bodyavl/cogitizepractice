const Movie = require('./db/models/movie');
async function getRandomMovies(options, limit = 8){
  return await Movie.aggregate([{ $match: { ...options } }, { $sample: { size: limit } }]);
}
module.exports = {
  getRandomMovies
};
