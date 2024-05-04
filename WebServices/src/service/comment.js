const { db } = require("../data/models");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const { getDateOnly } = require("../core/dateParser");

async function create({ username, postId, content }) {
    try {
        const date = getDateOnly(new Date());
        const newComment = { username, postId, dateCreated: date, dateLastChanged: date, content };
        return await db.Comment.create(newComment);
    } catch(error) {
        throw handleDBError(error);
    }
}

async function updateById(id, { username, content }) {
    const comment = await db.Comment.findByPk(id);
    if (!comment) {
        throw ServiceError.notFound(`No comment with id ${id} exists`, { id });
    }

    if (comment.username !== username) {
        throw ServiceError.forbidden(`You do not have permission to edit this content`, { username });
    }

    try {
        comment.set({
            dateLastChanged: getDateOnly(new Date()),
            content,
        });
        await comment.save();
        return comment.toJSON();
    } catch (error) {
        throw handleDBError(error);
    }
}

async function deleteById(id, { username }) {
    const deletedComment = await db.Comment.destroy({ where: { id, username }});
    if (!deletedComment) {
        throw ServiceError.notFound(`No comment with id ${id} exists`, { id });
    }
}

module.exports = {
    create,
    updateById,
    deleteById,
};
