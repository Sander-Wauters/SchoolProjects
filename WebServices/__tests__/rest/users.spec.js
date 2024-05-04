const { withServer, login } = require("../supertest.setup");
const { test401Unauthorized } = require("../common/clientErrors");
const { hashPassword } = require("../../src/core/password");
const Roles = require("../../src/core/roles");

describe("Users", () => {
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
    
    const url = "/api/users";

    beforeAll(async () => {
        userAuthHeader = await login(request);
    });

    describe("GET /api/users", () => {
        it("should 200 and return all users", async () => {
            const response = await request.get(url).set("Authorization", userAuthHeader);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

            expect(response.body[0]).toEqual({
                username: "admin",
                role: Roles.ADMIN,
            });
            expect(response.body[1]).toEqual({
                username: "user",
                role: Roles.USER,
            });
        });

        test401Unauthorized(() => request.get(url));
    });

    describe("GET /api/users/:username", () => {
        it("should 200 and return the requested user", async () => {
            const response = await request.get(`${url}/user`).set("Authorization", userAuthHeader);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                username: "user",
                role: Roles.USER,
                email: "user@mail.com",
            });
        });

        test401Unauthorized(() => request.get(`${url}/user`));
    });
 
    describe("DELETE /api/users/:username", () => {
        afterAll(async () => {
            const passwordHash = await hashPassword("Server2022");
            await queryInterface.bulkInsert("User", [
                {
                    username: "user",
                    role: Roles.USER,
                    email: "user@mail.com",
                    passwordHash,
                },
            ]);
        });

        it("should 204 and return nothing and a placeholder should be created", async () => {
            const response = await request.delete(`${url}/user`).set("Authorization", userAuthHeader);

            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});

            const getResponse = await request.get(`${url}`).set("Authorization", userAuthHeader);

            expect(getResponse.body.length).toBe(2);
            expect(getResponse.body[0]).toEqual({
                username: "admin",
                role: Roles.ADMIN,
            });
            expect(getResponse.body[1]).toEqual({
                username: "deleted_user",
                role: Roles.USER,
            });

        });

        test401Unauthorized(() => request.delete(`${url}/user`));
    });
});
