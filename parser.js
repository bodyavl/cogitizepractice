const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios").default;
const database = require("./database/index");
const Movie = require("./database/schemas/movie");
const { post } = require("./routers/movie");

async function parser() {
    for (let i = 0; i < 500; i++) {
        try {
            const result = await axios.get(`https://api.themoviedb.org/3/movie/${i}?`, {
                params: {
                    api_key: process.env.TMBD_API_KEY
                }
            })
            const {
                id,
                title,
                overview,
                genres,
                poster_path,
                vote_average,
            } = result.data;

            Movie.create(
                {
                    id: id,
                    title: title,
                    description: overview,
                    genre: genres,
                    poster: `https://image.tmdb.org/t/p/original${poster_path}`,
                    rating: vote_average,
                }
            )
            console.log(id);
        }
        catch (error) {
            console.log("not found");
        }
    }
}
parser();