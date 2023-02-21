const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config();


const app = process.env.APP_URL;
console.log("app",app)
describe("Movies API",()=>{
    let movieId  = "63f52090bb8944b245cf824a";
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
            id: "79518009m",
            title: "test title",
            description: "test desc",
            type: "Movie",
            poster: "test poster",
            backdrop: "test backdrop",
            tagline: "test tagline",
            genres: [{name: "Action"}, {name: "Drama"}],
            date: undefined,
            runtime: 100,
            rating: 5,
        })
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toEqual("79518009m");
        expect(res.body.title).toEqual("test title")
        expect(res.body.description).toEqual("test desc")
        expect(res.body.type).toEqual("Movie")
        expect(res.body.poster).toEqual("test poster")
        expect(res.body.backdrop).toEqual("test backdrop")
        expect(res.body.tagline).toEqual("test tagline")
        expect(res.body.genres).toBeInstanceOf(Array)
        expect(res.body.genres).toEqual([{name: "Action"}, {name: "Drama"}])
        expect(res.body.date).toEqual(undefined)
        expect(res.body.runtime).toEqual(100)
        expect(res.body.rating).toEqual(5)
    })
});