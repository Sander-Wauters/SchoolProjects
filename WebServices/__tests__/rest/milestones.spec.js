const { withServer, login } = require("../supertest.setup");
const { test401Unauthorized, test404NotFound } = require("../common/clientErrors");

const data = {
    milestones: [
        {
            username: "admin",
            tag: "development",
            accomplished: true,
            imagePath: "/images/milestones/img0",
            title: "title 0",
            content: "content 0",
        },
        {
            username: "admin",
            tag: "bugs",
            accomplished: false,
            imagePath: "/images/milestones/img1",
            title: "title 1",
            content: "content 1",
        },
    ],
};

describe("Milestones", () => {
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
    
    const url = "/api/milestones";

    beforeAll(async () => {
        adminAuthHeader = await login(request, "admin");
    });

    describe("GET /api/milestones", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("Milestone", data.milestones);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("Milestone", null, {});
            await sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
        });

        it("should 200 and return all milestones", async () => {
            const response = await request.get(url);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

            expect(response.body[0]).toEqual({
                id: 1,
                ...data.milestones[0],
            })
            expect(response.body[1]).toEqual({
                id: 2,
                ...data.milestones[1],
            })
        });
    });

    describe("POST /api/milestones", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("Milestone", null, {});
            await sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
        }); 
        
        const milestone = {
            tag: "development",
            accomplished: true,
            imagePath: "/images/milestones/img0",
            title: "POST title",
            content: "POST content",
        };

        it("should 201 and return the created milestone", async () => {
            const response = await request.post(url).send(milestone).set("Authorization", adminAuthHeader);

            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy();
            expect(response.body.username).toBe("admin");
            expect(response.body.tag).toBe(milestone.tag);
            expect(response.body.date).toBe(milestone.date);
            expect(response.body.title).toBe(milestone.title);
            expect(response.body.content).toBe(milestone.content);
        });

        test401Unauthorized(() => request.post(url).send(milestone));
        test404NotFound(() => request.post(url).send({
            tag: "NOT_A_VALID_TAG",
            accomplished: true,
            imagePath: "/images/milestones/img0",
            title: "POST title",
            content: "POST content",
        }).set("Authorization", adminAuthHeader));
    });

    describe("PUT /api/milestones/:id", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("Milestone", data.milestones);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("Milestone", null, {});
            await sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
        });

        const milestone = {
            tag: "development",
            accomplished: true,
            imagePath: "/images/milestones/img0",
            title: "POST title",
            content: "POST content",
        };

        it("should 200 and return the updated milestone", async () => {
            const response = await request.put(`${url}/1`).send(milestone).set("Authorization", adminAuthHeader);

            expect(response.status).toBe(200);
            expect(response.body.id).toBeTruthy();
            expect(response.body.username).toBe("admin");
            expect(response.body.tag).toBe(milestone.tag);
            expect(response.body.accomplished).toBe(milestone.accomplished);
            expect(response.body.title).toBe(milestone.title);
            expect(response.body.content).toBe(milestone.content);
        });

        test401Unauthorized(() => request.put(`${url}/1`).send(milestone));
        test404NotFound(() => request.put(`${url}/1000`).send(milestone).set("Authorization", adminAuthHeader));
        test404NotFound(() => request.put(`${url}/1`).send({
            tag: "NOT_A_VALID_TAG",
            accomplished: true,
            imagePath: "/images/milestones/img0",
            title: "POST title",
            content: "POST content",
        }).set("Authorization", adminAuthHeader));
    });

    describe("DELETE /api/milestones/:id", () => {
        beforeAll(async () => {
            await sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
            await queryInterface.bulkInsert("Milestone", data.milestones);
        });

        afterAll(async () => {
            await queryInterface.bulkDelete("Milestone", null, {});
            await sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
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
