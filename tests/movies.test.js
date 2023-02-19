const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();

const app = process.env.APP_URL;

describe("Movies API", () => {
    //let axiosMovieId = 550;


    test("Should return all movies", async () => {
        const res = await request(app).get("/movie/all");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    let movieId;

    /*test("Should return movie by id from TMDB", async () => {
        const res = await request(app).get(`/movie/axios/${axiosMovieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
    });*/


    test("Should create movie", async () => {
        const res = await request(app).post(`/movie/add`).set('Accept', 'application/json').send(
            {
                title: "test title",
                author: "test author",
                rating: 6,
                runtime: 180,
                genre: "test genre"
            }
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual("test title");
        expect(res.body.author).toEqual("test author");
        expect(res.body.rating).toEqual(6);
        expect(res.body.runtime).toEqual(180);
        expect(res.body.genre).toEqual("test genre");
        movieId = res.body._id;
    });

    test("Should return created movie by id", async () => {
        const res = await request(app).get(`/movie/${movieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("author");
    });
});