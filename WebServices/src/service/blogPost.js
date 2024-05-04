const { db } = require("../data/models");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const { getDateOnly } = require("../core/dateParser");

async function getAll() {
    const blogPosts = await db.BlogPost.findAll({
        order: [["date", "DESC"], ["id", "DESC"]],
    });
    return blogPosts;
}

async function getById(id) {
    const blogPost = await db.BlogPost.findByPk(id, { include: db.Comment });
    if (!blogPost) {
        throw ServiceError.notFound(`No blog post with id ${id} exists`, { id });
    }
    return blogPost;
}

async function create({ username, tag, title, content }) {
    try {
        const newBlogPost = await db.BlogPost.create({ username, tag, date: getDateOnly(new Date()), title, content });
        return newBlogPost.toJSON();
    } catch (error) {
        throw handleDBError(error);   
    }
}

async function updateById(id, { tag, title, content }) {
    const blogPost = await db.BlogPost.findByPk(id);
    if (!blogPost) {
        throw ServiceError.notFound(`No blog post with id ${id} exists`, { id });
    }

    try {
        blogPost.set({ tag, title, content });
        await blogPost.save();
        return blogPost.toJSON();
    } catch (error) {
        throw handleDBError(error);
    }
}

async function deleteById(id) {
    const existingBlogPost = await db.BlogPost.findByPk(id);
    if (!existingBlogPost) {
        throw ServiceError.notFound(`No blog post with id ${id} exists`, { id });
    }

    try {
        await db.Comment.destroy({ where: { postId: id }});
        await db.BlogPost.destroy({ where: { id }});
    } catch (error) {
        throw handleDBError(error);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};
