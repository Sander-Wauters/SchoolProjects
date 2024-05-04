const Joi = require("joi");
const Router = require("@koa/router");
const { requireAuthentication } = require("../core/auth");
const validate = require("../core/validation");
const commentService = require("../service/comment");
const userService = require("../service/user");

async function createComment(ctx) {
    const { username } = await userService.checkAndParseSession(ctx.headers.authorization);
    const newComment = await commentService.create({ username, ...ctx.request.body });
    ctx.status = 201;
    ctx.body = newComment;
}
createComment.validationScheme = {
    body: {
        postId: Joi.number().integer().positive(),
        content: Joi.string(),
    },
};

async function updateCommentById(ctx) {
    const { username } = await userService.checkAndParseSession(ctx.headers.authorization);
    const newComment = await commentService.updateById(ctx.params.id, { username, ...ctx.request.body });
    ctx.body = newComment;
}
updateCommentById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
    body: {
        content: Joi.string(),
    },
};

async function deleteCommentById(ctx) {
    const { username } = await userService.checkAndParseSession(ctx.headers.authorization);
    await commentService.deleteById(ctx.params.id, { username });
    ctx.status = 204;
}
deleteCommentById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

module.exports = (app) => {
    const router = new Router({
        prefix: "/comments",
    });

    router.post("/", requireAuthentication, validate(createComment.validationScheme), createComment);

    router.put("/:id", requireAuthentication, validate(updateCommentById.validationScheme), updateCommentById);
    router.delete("/:id", requireAuthentication, validate(deleteCommentById.validationScheme), deleteCommentById);

    app.use(router.routes()).use(router.allowedMethods());
};
