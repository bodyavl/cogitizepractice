const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();

const app = process.env.APP_URL;
console.log("app", app);
describe("Movies API", () => {
    test("should return all movies", async () => {
        const res = await request(app).get("/movie/list");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    let movieId;
    test("should create a movie", async () => {
        const res = await request(app).post("/movie/create").set('Accept', 'application/json').send({
            title: "test title",
            author: "test author",
            description: "test description",
            genre: "test genre",
            rating: 5
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual("test title");
        expect(res.body.author).toEqual("test author");
        expect(res.body.description).toEqual("test description");
        expect(res.body.genre).toEqual("test genre");
        expect(res.body.rating).toEqual(5);
        // expect(res.body.date).toEqual(new Date(2022, 0, 1, 0, 0, 0, 0).getTime());
        movieId = res.body._id;
    });

    test("should return created movie", async () => {
        const res = await request(app).get(`/movie/${movieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("author");
        expect(res.body).toHaveProperty("description");
        expect(res.body).toHaveProperty("genre");
        expect(res.body).toHaveProperty("rating");
        // expect(res.body).toHaveProperty("date");
    })
});