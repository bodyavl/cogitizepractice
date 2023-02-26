const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');

const app = process.env.APP_URL;

describe("Suggest API", () => {
    let movieId;
    jest.setTimeout(60000)
    test("Should return 8 movies from MongoDB", async() => {
        const res = await request(app).get("/movie/list");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(8);
        movieId = res.body[0]._id;
    });
    test("Should return movie by id in MongoDB", async() => {
        const res = await request(app).get(`/movie/${movieId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
    });

    test("Should add movie to MongoDB", async () => {
        const res = await request(app).post("/movie/create").set("Accept", "application/json").send({
            id: "1m",
            title: "test title",
            description: "test desc",
            type: "Movie",
            poster: "test poster",
            backdrop: "test backdrop",
            tagline: "test tagline",
            genres: [{name: "Action"}, {name: "Drama"}],
            date: new Date(2022, 0, 1, 0, 0, 0, 0).getTime(),
            runtime: 100,
            rating: 5,
        })
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toEqual("1m");
        expect(res.body.title).toEqual("test title")
        expect(res.body.description).toEqual("test desc")
        expect(res.body.type).toEqual("Movie")
        expect(res.body.poster).toEqual("test poster")
        expect(res.body.backdrop).toEqual("test backdrop")
        expect(res.body.tagline).toEqual("test tagline")
        expect(res.body.genres).toBeInstanceOf(Array)
        expect(res.body.genres).toEqual([{name: "Action"}, {name: "Drama"}])
        expect(res.body.date).toEqual("2021-12-31T22:00:00.000Z")
        expect(res.body.runtime).toEqual(100)
        expect(res.body.rating).toEqual(5)


    })
})