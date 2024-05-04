const Roles = require("../../core/roles");
const { hashPassword } = require("../../core/password");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const passwordHash = await hashPassword("Server2022");
        await queryInterface.bulkInsert("User", [
            {
                username: "admin",
                role: Roles.ADMIN,
                email: "admin@mail.com",
                passwordHash,
            },
            {
                username: "user",
                role: Roles.USER,
                email: "user@mail.com",
                passwordHash,
            },
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("User", null, {});
    },
};
