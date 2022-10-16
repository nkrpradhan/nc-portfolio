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

describe("GET /api", () => {
  test("Get the details of endpoint  ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { availableEndpoints } = body;
        expect(availableEndpoints).toEqual(
          expect.objectContaining({
            "GET /api/topics": {
              description: "serves an array of all topics",
              queries: [],
              exampleResponse: {
                topics: [{ slug: "football", description: "Footie!" }],
              },
            },
          })
        );
      });
  });
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
          msg: "Article Id not found",
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
          comment_count: 1,
        });
      });
  });
});

describe("GET /api/users", () => {
  test("GET the response of api/users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });

  test("GET the value of a user from api/users and compare with the expected value", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        const expected = {
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        };
        expect(users[0]).toEqual(expected);
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Bad request check", () => {
    const reqObj = { inc_votes: "e1" };
    return request(app)
      .patch("/api/articles/1")
      .send(reqObj)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Bad Request",
        });
      });
  });
  test("Check for article id not present", () => {
    const reqObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/3331")
      .send(reqObj)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Article Id not found",
        });
      });
  });
  test("Increase the vote count by 2 for id 1", () => {
    const reqObj = { inc_votes: 2 };
    return request(app)
      .patch("/api/articles/1")
      .send(reqObj)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 102,
        });
      });
  });
  test("Decrease the vote count by 10 for id 1", () => {
    const reqObj = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(reqObj)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 92,
        });
      });
  });
});

describe("GET /api/articles with comment count", () => {
  test("GET response object from the api/articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("Get the articles response in desc order as default sorted by created date as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });

  test("Bad request", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("Get the articles respone in desc order as default sorted by comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSorted({ key: "comment_count", descending: true });
      });
  });

  test("Get the articles respone in asc order sorted by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSorted({ key: "title", descending: false });
      });
  });

  test("Check for invalid column in sort by query", () => {
    return request(app)
      .get("/api/articles?sort_by=id&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Invalid sort query",
        });
      });
  });
  test("Check for invalid column in sort by query", () => {
    return request(app)
      .get("/api/articles?order=wqasc")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Invalid order query",
        });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("GET Status 200 with the comments response for the article id 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("GET Status 200 with the most recent comments for the article id 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSorted({ key: "comment_id", descending: true });
      });
  });

  test("GET Status 404 if article id not present", () => {
    return request(app)
      .get("/api/articles/1222/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Article Id not found",
        });
      });
  });
  test("GET Status 404 if comments not present for the article", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Comments not present for the article",
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Bad Request check", () => {
    const commentsObj = {
      body: "Post test",
      user: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentsObj)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Bad Request",
        });
      });
  });

  test("Post a comment and get the posted comment", () => {
    const commentsObj = {
      body: "Post test",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentsObj)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 1,
            body: "Post test",
            author: "icellusedkars",
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("Check for nonexistent article id", () => {
    const commentsObj = {
      body: "Post test",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1222/comments")
      .send(commentsObj)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Article Id not found",
        });
      });
  });

  test("Check for invalid article id", () => {
    const commentsObj = {
      body: "Post test",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/eee/comments")
      .send(commentsObj)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Bad Request",
        });
      });
  });

  test("Check for nonexistent user id", () => {
    const commentsObj = {
      body: "Post test",
      username: "icellused",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentsObj)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "User Id not found",
        });
      });
  });

  test("Ignores request property not present in comment table", () => {
    const commentsObj = {
      body: "Property test",
      username: "icellusedkars",
      testprop: "hello",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentsObj)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 1,
            body: "Property test",
            author: "icellusedkars",
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
        expect(comment).not.toHaveProperty("testprop");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Bad Request: Get error if the comment id is not valid", () => {
    return request(app)
      .delete("/api/comments/wwww")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Bad Request",
        });
      });
  });

  test("Get error if the comment id is not present", () => {
    return request(app)
      .delete("/api/comments/12222")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Comment Id not found",
        });
      });
  });

  test("Delete the comment if the comment id is present", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
});

describe("GET /api/users/:username", () => {
  test("Check for user id not present", () => {
    return request(app)
      .get("/api/users/ere")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "User Id not found",
        });
      });
  });

  test("Check for user id present and user response", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
});
