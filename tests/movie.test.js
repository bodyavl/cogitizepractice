const request = require("supertest")

const dotenv = require("dotenv")
dotenv.config()

const app = process.env.APP_URL
console.log("app", app)
describe("Movie API", ()=>{
    test("Should return all movies", async()=>{
        const res = await request(app).get("/movie/list")
        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeInstanceOf(Array)
    })

    let movieId
    test("Should add a movie", async()=>{
        const res = await request(app)
        .post("/movie/add")
        .set("Accept", "application/json")
        .send({
            title: "test title",
            author: "test author",
            description: "test description",
        })
        expect(res.statusCode).toEqual(200)
        expect(res.body.title).toEqual("test title")
        expect(res.body.author).toEqual("test author")
        expect(res.body.description).toEqual("test description")
        movieId = res.body._id
    })

    test("Should return created movie", async ()=>{
        const res = await request(app).get(`/movie/${movieId}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty("title")
        expect(res.body).toHaveProperty("author")
        expect(res.body).toHaveProperty("description")
    })
})