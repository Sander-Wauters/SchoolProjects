const config = require("config");
const { initializeLogger } = require("../src/core/logging");
const { hashPassword } = require("../src/core/password");
const Roles = require("../src/core/roles");
const { initializeData, db } = require("../src/data/models");

module.exports = async () => {
    initializeLogger({
        level: config.get("log.level"),
        disabled: config.get("log.disabled"),
    });
    await initializeData();

    const passwordHash = await hashPassword("Server2022");

    await db.sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
    await db.sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
    await db.sequelize.query("ALTER TABLE comment AUTO_INCREMENT = 0")

    const queryInterface = db.sequelize.getQueryInterface();
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
    await queryInterface.bulkInsert("Tag", [
        {
            name: "development",
        },
        {
            name: "info",
        },
        {
            name: "bugs",
        },
    ]);
};
