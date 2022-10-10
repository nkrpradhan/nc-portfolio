const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => {
  if (db.end) db.end();
});

beforeAll(() => {
  return seed(testData);
});

describe("GET /api/topics", () => {
  test("Get error for invalid route", () => {
    return request(app)
      .get("/api/top")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Route Not Found",
        });
      });
  });
  test("Get status of /api/topics", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("Get /api/topics returns an array of topic objects with slug and description as properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET error as bad request for /api/articles/:article_id", () => {
    return request(app)
      .get("/api/articles/:article_id")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Bad Request",
        });
      });
  });
  test("GET error if article id not present", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 404,
          msg: "Id not found",
        });
      });
  });
  test("GET article object for /api/articles/6", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          author: "sam",
          title: "A",
          article_id: 6,
          body: "Delicious tin of cat food",
          topic: "mitch",
          created_at: "2020-10-18T01:00:00.000Z",
          votes: 0,
        });
      });
  });
});