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
