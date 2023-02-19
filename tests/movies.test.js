const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();


const app = process.env.APP_URL;
console.log("app",app)
describe("Movies API",()=>{
    test("should return all movies",async()=>{
        const res = await request(app).get("/movie/list");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    test("Should return movie by id from TMDB", async () => {
        const res = await request(app).get(`/movie/getMovieFromTMDB/550`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
    });

    let movieId;
    test("should create a movie", async () => {
        const res = await request(app).post("/movie/create").send({
            title: "test title",
            type: "test type",
            time: 150,
            genres: "test genres", 
            author: "test author",
            description: "test description",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual("test title");
        expect(res.body.type).toEqual("test type");
        expect(res.body.time).toEqual(150);
        expect(res.body.genres).toEqual("test genres");
        expect(res.body.author).toEqual("test author");
        expect(res.body.description).toEqual("test description");
        movieId = res.body._id;
    });

    test("should return created movie", async () => {
        const res = await request(app).get(`/movie/${movieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("type");
        expect(res.body).toHaveProperty("time");
        expect(res.body).toHaveProperty("genres");
        expect(res.body).toHaveProperty("author");
        expect(res.body).toHaveProperty("description");
    })
});