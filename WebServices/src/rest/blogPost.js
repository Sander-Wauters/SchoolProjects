const Joi = require("joi");
const Router = require("@koa/router");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Roles = require("../core/roles");
const validate = require("../core/validation");
const blogPostService = require("../service/blogPost");
const userService = require("../service/user");

async function getAllBlogPosts(ctx) {
    ctx.body = await blogPostService.getAll();
}
getAllBlogPosts.validationScheme = null;

async function getBlogPostById(ctx) {
    ctx.body = await blogPostService.getById(ctx.params.id);
}
getBlogPostById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

async function createBlogPost(ctx) {
    const { username } = await userService.checkAndParseSession(ctx.headers.authorization);
    const newBlogPost = await blogPostService.create({ username, ...ctx.request.body });
    ctx.status = 201;
    ctx.body = newBlogPost;
}
createBlogPost.validationScheme = {
    body: {
        tag: Joi.string().max(255),
        title: Joi.string().max(255),
        content: Joi.string(),
    },
};

async function updateBlogPostById(ctx) {
    const newBlogPost = await blogPostService.updateById(ctx.params.id, {...ctx.request.body})
    ctx.body = newBlogPost;
}
updateBlogPostById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
    body: {
        tag: Joi.string().max(255).optional(),
        title: Joi.string().max(255).optional(),
        content: Joi.string().optional(),
    },
}

async function deleteBlogPostById(ctx) {
    await blogPostService.deleteById(ctx.params.id);
    ctx.status = 204;
}
deleteBlogPostById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

module.exports = (app) => {
    const router = new Router({
        prefix: "/blogPosts",
    });

    const requireAdmin = makeRequireRole(Roles.ADMIN);

    router.get("/", validate(getAllBlogPosts.validationScheme), getAllBlogPosts);
    router.get("/:id", validate(getBlogPostById.validationScheme), getBlogPostById);

    router.post("/", requireAuthentication, validate(createBlogPost.validationScheme), requireAdmin, createBlogPost);
    router.put("/:id", requireAuthentication, validate(updateBlogPostById.validationScheme), requireAdmin, updateBlogPostById);
    router.delete("/:id", requireAuthentication, validate(deleteBlogPostById.validationScheme), requireAdmin, deleteBlogPostById);

    app.use(router.routes()).use(router.allowedMethods());
};
