const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();

const app = process.env.APP_URL;

describe("Movies API", () => {

    test("Should return all movies", async () => {
        const res = await request(app).get("/movie/all");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    test("Should return tranding movie by day from TMDB", async () => {
        const res = await request(app).get("/movie/TMDB/day");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
    });

    test("Should return tranding movie by week from TMDB", async () => {
        const res = await request(app).get("/movie/TMDB/week");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
    });

    let movieId;

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
        expect(res.body).toBeInstanceOf(Object);
    });
});