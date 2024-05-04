const Router = require("@koa/router");
const validate = require("../core/validation");
const tagService = require("../service/tag");

async function getAllTags(ctx) {
    ctx.body = await tagService.getAll();
}
getAllTags.validationScheme = null;

module.exports = (app) => {
    const router = new Router({
        prefix: "/tags",
    });

    router.get("/", validate(getAllTags.validationScheme), getAllTags);

    app.use(router.routes()).use(router.allowedMethods());
};
