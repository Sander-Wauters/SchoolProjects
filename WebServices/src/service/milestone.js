const { db } = require("../data/models");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");

async function getAll() {
    const milestones = await db.Milestone.findAll();
    return milestones;
}

async function create({ username, tag, accomplished, imagePath, title, content }) {
    try {
        const newMilestone = await db.Milestone.create({ username, tag, accomplished, imagePath, title, content });
        return newMilestone.toJSON();
    } catch (error) {
        throw handleDBError(error);
    }
}

async function updateById(id, { tag, accomplished, imagePath, title, content }) {
    const milestone = await db.Milestone.findByPk(id);
    if (!milestone) {
        throw ServiceError.notFound(`No milestone with id ${id} exists`, { id });
    }
    try {
        milestone.set({ tag, accomplished, imagePath, title, content });
        await milestone.save();
        return milestone.toJSON();
    } catch(error) {
        throw handleDBError(error);
    }
}

async function deleteById(id) {
    const deleted = await db.Milestone.destroy({ where: { id }});
    if (!deleted) {
        throw ServiceError.notFound(`No milestone with id ${id} exists`, { id });
    }
}

module.exports = {
    getAll,
    create,
    updateById,
    deleteById,
};
