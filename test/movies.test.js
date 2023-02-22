const dotenv = require("dotenv");
dotenv.config();
const request = require("supertest");

const app = process.env.APP_URL;
console.log("app",app)
describe("Movies API",()=>{
    it("should return all movies", async()=>{
        const res = await request(app).get("/movie/list");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    })
    let movieId;
it("should create a movie", async()=>{
    const res = await request(app).post("/movie/createMovie").set("Accept", "application/json").send({

        title:"test title",
       description: "test description",
       rating:7,
        genre:"test genre",
        run_time: "test run_time",
        backdrop: "test backdrop",
        logo: "test logo",
   });
   expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual("test title");
        expect(res.body.description).toEqual("test description");
        expect(res.body.rating).toEqual(7);
        expect(res.body.genre).toEqual("test genre");
        expect(res.body.run_time).toEqual("test run_time");
        expect(res.body.backdrop).toEqual("test backdrop");
        expect(res.body.logo).toEqual("test logo");
       movieId = res.body._id;

});

it("should return created movie", async()=>{
    const res = await request(app).get(`/movie/${movieId}`);
   
   expect(res.statusCode).toEqual(200);
   expect(res.body).toHaveProperty("title");
   expect(res.body).toHaveProperty("description");
   expect(res.body).toHaveProperty("country");
   expect(res.body).toHaveProperty("rating");
   expect(res.body).toHaveProperty("run_time");
   expect(res.body).toHaveProperty("genre");
   expect(res.body).toHaveProperty("backdrop");
   expect(res.body).toHaveProperty("logo");
   
   })
})