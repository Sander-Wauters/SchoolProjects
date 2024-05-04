const supertest = require("supertest");
const createServer = require("../src/createServer");
const { db } = require("../src/data/models");

async function login(supertest, username="user") {
    const response = await supertest.post("/api/users/login").send({ username, password: "Server2022" });

    if (response.statusCode !== 200) {
        throw new Error(response.body.message || "Unkown error occured");
    }

    return ` Bearer ${response.body.token}`;
}

function withServer(setter) {
    let server;

    beforeAll(async () => {
        server = await createServer();
        setter({
            sequelize: db.sequelize,
            queryInterface: db.sequelize.getQueryInterface(),
            supertest: supertest(server.getApp().callback()),
        });
    });

    afterAll(async () => {
        await server.stop();
    });
}

module.exports = {
    login,
    withServer,
};
