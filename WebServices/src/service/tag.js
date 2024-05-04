const { db } = require("../data/models");

async function getAll() {
    const tags = await db.Tag.findAll();
    return tags;
}

module.exports = {
    getAll,
};
