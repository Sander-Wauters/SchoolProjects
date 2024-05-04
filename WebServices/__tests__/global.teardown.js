const { shutdownData, db } = require("../src/data/models"); 

module.exports = async () => {
    const queryInterface = db.sequelize.getQueryInterface();

    await queryInterface.bulkDelete("Comment", null, {});
    await queryInterface.bulkDelete("BlogPost", null, {});
    await queryInterface.bulkDelete("Milestone", null, {});
    await queryInterface.bulkDelete("User", null, {});
    await queryInterface.bulkDelete("Tag", null, {});

    await db.sequelize.query("ALTER TABLE blogpost AUTO_INCREMENT = 0")
    await db.sequelize.query("ALTER TABLE milestone AUTO_INCREMENT = 0")
    await db.sequelize.query("ALTER TABLE comment AUTO_INCREMENT = 0")

    await shutdownData(); 
};
