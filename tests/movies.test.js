const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();

const app = process.env.APP_URL;
describe("Movie API", () => {
    test("should return all movies", async () => {
        const res = await request(app).get("/movie/list");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    let movieId;
    test("should create a movie", async () => {
        const res = await request(app).post("/movie/createMovie").set('Accept', 'application/json').send({
            id: 1,
            title: "test title",
            author: "test author",
            description: "test description",
            releaseYear: "test releaseYear",
            genre: "test genre"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toEqual(1);
        expect(res.body.title).toEqual("test title");
        expect(res.body.author).toEqual("test author");
        expect(res.body.description).toEqual("test description");
        expect(res.body.releaseYear).toEqual("test releaseYear");
        expect(res.body.genre).toEqual("test genre");
        movieId = res.body._id;
    });

    test("should return created movie", async () => {
        const res = await request(app).get(`/movie/${movieId}`);
        console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty(1);
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("author");
        expect(res.body).toHaveProperty("description");
        expect(res.body).toHaveProperty("releaseYear");
        expect(res.body).toHaveProperty("genre");
 })
});
