const Router = require("@koa/router");
const installBlogPostRouter = require("./blogPost");
const installTagRouter = require("./tag");
const installCommentRouter = require("./comment");
const installMilestoneRouter = require("./milestone");
const installUserRouter = require("./user");
const installHealthRouter = require("./health");

module.exports = (app) => {
    const router = new Router({
        prefix: "/api",
    });

    installBlogPostRouter(router);
    installTagRouter(router);
    installCommentRouter(router);
    installMilestoneRouter(router);
    installUserRouter(router);
    installHealthRouter(router);

    app.use(router.routes()).use(router.allowedMethods());
};
