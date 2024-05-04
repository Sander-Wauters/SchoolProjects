const Router = require("@koa/router");
const healthService = require("../service/health");

async function ping(ctx) {
    ctx.status = 200;
    ctx.body = healthService.ping();
}

async function getVersion(ctx) {
    ctx.status = 200;
    ctx.body = healthService.getVersion();
}

module.exports = (app) => {
    const router = new Router({
        prefix: "/health",
    });

    router.get("/ping", ping);
    router.get("/version", getVersion);

    app.use(router.routes()).use(router.allowedMethods());
};

