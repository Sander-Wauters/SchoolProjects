const { withServer, login } = require("../supertest.setup");
const { test401Unauthorized, test403Forbidden, test404NotFound } = require("../common/clientErrors");

const data = {
    blogPosts: [
        {
            username: "admin",
            tag: "development",
            date: "2023-11-14",
            title: "title admin",
            content: "content admin",
        },
    ],
    comments: [
        {
            postId: 1,
            username: "user",
            dateCreated: "2023-11-14",
            dateLastChanged: null,
            content: "content user 0",
        },
        {
            postId: 1,
            username: "admin",
            dateCreated: "2023-11-14",
            dateLastChanged: "2024-10-16",
            content: "content admin 0",
        },
    ],
};

describe("Comments", () => {
    let request;
    let sequelize;
    let queryInterface;

    withServer(({
        supertest,
        sequelize: s,
        queryInterface: q,
    }) => {
        request = supertest,
        sequelize = s,
        queryInterface = q
        });

    const url = "/api/comments";

    beforeAll(async () => {
        userAuthHeader = await login(request);
    });

    describe("POST /api/comments", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await sequelize.query("ALTER TABLE comment AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("BlogPost", data.blogPosts);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("Comment", null, {});
            await queryInterface.bulkDelete("BlogPost", null, {});
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await sequelize.query("ALTER TABLE comment AUTO_INCREMENT = 0")
        });

        const comment = {
            postId: 1,
            content: "POST content",
        };

        it("should 201 and return the created comment", async () => {
            const response = await request.post(url).send(comment).set("Authorization", userAuthHeader);

            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy();
            expect(response.body.postId).toBe(comment.postId);
            expect(response.body.username).toBe("user");
            expect(response.body.dateCreated).toBeTruthy();
            expect(response.body.dateLastChanged).toBeTruthy();
            expect(response.body.content).toBe(comment.content);
        });

        test401Unauthorized(() => request.post(url).send(comment));
        test404NotFound(() => request.post(url).send({
            postId: 1000,
            content: "POST content",
        }).set("Authorization", userAuthHeader));
    });

    describe("PUT /api/comments/:id", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await sequelize.query("ALTER TABLE comment AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("BlogPost", data.blogPosts);
            await queryInterface.bulkInsert("Comment", data.comments);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("Comment", null, {});
            await queryInterface.bulkDelete("BlogPost", null, {});
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await sequelize.query("ALTER TABLE comment AUTO_INCREMENT = 0")
        });

        it("should 200 and return the updated comment", async () => {
            const response = await request.put(`${url}/1`).send({ content: "PUT content" }).set("Authorization", userAuthHeader);

            expect(response.status).toBe(200);
            expect(response.body.id).toBeTruthy();
            expect(response.body.postId).toBe(data.comments[0].postId);
            expect(response.body.username).toBe("user");
            expect(response.body.dateCreated).toBeTruthy();
            expect(response.body.dateLastChanged).toBeTruthy();
            expect(response.body.content).toBe("PUT content");
        });

        test401Unauthorized(() => request.put(`${url}/1`).send({ content: "PUT content" }));
        test403Forbidden(() => request.put(`${url}/2`).send({ content: "PUT content" }).set("Authorization", userAuthHeader))
        test404NotFound(() => request.put(`${url}/1000`).send({ content: "PUT content" }).set("Authorization", userAuthHeader));
    });

    describe("DELETE /api/comments/:id", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await sequelize.query("ALTER TABLE comment AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("BlogPost", data.blogPosts);
            await queryInterface.bulkInsert("Comment", data.comments);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("Comment", null, {});
            await queryInterface.bulkDelete("BlogPost", null, {});
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await sequelize.query("ALTER TABLE comment AUTO_INCREMENT = 0")
        });

        it("should 204 and return nothing", async () => {
            const response = await request.delete(`${url}/1`).set("Authorization", userAuthHeader);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
        });

        test401Unauthorized(() => request.delete(`${url}/1`));
        test404NotFound(() => request.delete(`${url}/2`).set("Authorization", userAuthHeader))
    });
});
