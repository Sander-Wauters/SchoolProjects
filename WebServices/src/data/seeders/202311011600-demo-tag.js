module.exports = {
    up: async (queryInterface, Sequelize) => {
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
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Tag", null, {}); },
};
