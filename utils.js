const Movie = require('./db/models/movie');
async function getRandomMovies(limit = 8){
  return await Movie.aggregate([{ $sample: { size: limit } }]);
}
module.exports = {
  getRandomMovies
};
