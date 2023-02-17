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
    const res = await request(app)
      .post("/movie/create")
      .set("Accept", "application/json")
      .send({
        title: "test title",
        description: "test description",
        image: "test image",
        slogan: "test slogan",
        author: "test author",
        genres: "test genres",
        date: new Date(2022, 0, 1, 0, 0, 0, 0).getTime(),
        rating: 5,
        runTime: 200
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual("test title");
    expect(res.body.description).toEqual("test description");
    expect(res.body.image).toEqual("test image");
    expect(res.body.slogan).toEqual("test slogan");
    expect(res.body.author).toEqual("test author");
    expect(res.body.date).toEqual("2021-12-31T22:00:00.000Z");
    expect(res.body.rating).toEqual(5);
    expect(res.body.runTime).toEqual(200);
    movieId = res._body._id;
  });

  test("should return created movie", async () => {
    const res = await request(app).get(`/movie/${movieId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("image");
    expect(res.body).toHaveProperty("slogan");
  });
});
