const { withServer, login } = require("../supertest.setup");
const { test401Unauthorized, test404NotFound } = require("../common/clientErrors");

const data = {
    blogPosts: [
        {
            username: "admin",
            tag: "development",
            date: "2023-11-13",
            title: "title admin",
            content: "content admin",
        },
        {
            username: "admin",
            tag: "bugs",
            date: "2023-11-14",
            title: "title admin 2",
            content: "content admin 2",
        },
    ],
};

describe("BlogPosts", () => {
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
    
    const url = "/api/blogPosts";

    beforeAll(async () => {
        adminAuthHeader = await login(request, "admin");
    });

    describe("GET /api/blogPosts", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("BlogPost", data.blogPosts);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("BlogPost", null, {});
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
        });

        it("should 200 and return all blog posts", async () => {
            const response = await request.get(url);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

            expect(response.body[0]).toEqual({
                id: 2,
                ...data.blogPosts[1],
            });
            expect(response.body[1]).toEqual({
                id: 1,
                ...data.blogPosts[0],
            });
        });
    });

    describe("GET /api/blogPosts/:id", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("BlogPost", data.blogPosts);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("BlogPost", null, {});
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
        });

        it("should 200 and return the requested blog post", async () => {
            const response = await request.get(`${url}/1`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                ...data.blogPosts[0],
                Comments: [],
            });
        });

        test404NotFound(() => request.get(`${url}/1000`));
    });

    describe("POST /api/blogPosts", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("BlogPost", null, {});
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
        }); 


        const blogPost = { 
            tag: "bugs", 
            title: "POST title", 
            content: "POST content" 
        };

        it("should 201 and return the created blog post", async () => {
            const response = await request.post(url).send(blogPost).set("Authorization", adminAuthHeader);

            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy(),
            expect(response.body.username).toBe("admin");
            expect(response.body.tag).toBe(blogPost.tag);
            expect(response.body.date).toBeTruthy(),
            expect(response.body.title).toBe(blogPost.title);
            expect(response.body.content).toBe(blogPost.content);
        });

        test401Unauthorized(() => request.post(url).send(data.blogPosts[0]));
        test404NotFound(() => request.post(url).send({ 
            tag: "INVALID_TAG", 
            title: "POST title", 
            content: "POST content" 
        }).set("Authorization", adminAuthHeader));
    });

    describe("PUT /api/blogPosts/:id", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("BlogPost", data.blogPosts);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("BlogPost", null, {});
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
        });

        const updatedPost = { 
            tag: "info", 
            title: "PUT title", 
            content: "PUT content admin" 
        };

        it("should 200 and return the updated blog post", async () => {
            const response = await request.put(`${url}/1`).send(updatedPost).set("Authorization", adminAuthHeader);

            expect(response.status).toBe(200);
            expect(response.body.id).toBeTruthy();
            expect(response.body.username).toBe("admin");
            expect(response.body.tag).toBe(updatedPost.tag);
            expect(response.body.date).toBeTruthy();
            expect(response.body.title).toBe(updatedPost.title);
            expect(response.body.content).toBe(updatedPost.content);
        });

        test401Unauthorized(() => request.put(`${url}/1`).send(updatedPost));
        test404NotFound(() => request.put(`${url}/1000`).send(updatedPost).set("Authorization", adminAuthHeader));
        test404NotFound(() => request.put(`${url}/1`).send({
            tag: "INVALID_TAG", 
            title: "PUT title", 
            content: "PUT content admin" 
        }).set("Authorization", adminAuthHeader));
    });

    describe("DELETE /api/blogPosts/:id", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("BlogPost", data.blogPosts);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("BlogPost", null, {});
            await sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
        });

        it("should 204 and return nothing", async () => {
            const response = await request.delete(`${url}/1`).set("Authorization", adminAuthHeader);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
        });

        test401Unauthorized(() => request.delete(`${url}/1`));
        test404NotFound(() => request.delete(`${url}/1000`).set("Authorization", adminAuthHeader));
    });
});
