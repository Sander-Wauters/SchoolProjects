const { withServer } = require("../supertest.setup");

describe("Tags", () => {
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
    
    const url = "/api/tags";

    describe("GET /api/tags", () => {
        it("should 200 and return all tags", async () => {
            const response = await request.get(url);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
            expect(response.body[0]).toEqual({ name: "bugs" });
            expect(response.body[1]).toEqual({ name: "development" });
            expect(response.body[2]).toEqual({ name: "info" });
        });
    })
})
