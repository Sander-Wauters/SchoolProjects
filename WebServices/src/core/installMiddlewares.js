const config = require("config");
const bodyParser = require("koa-bodyparser");
const koaCors = require("@koa/cors");
const koaHelmet = require("koa-helmet");
const { getLogger } = require("./logging");
const ServiceError = require("./serviceError");

const NODE_ENV = config.get("env");
const CORS_ORIGINS = config.get("cors.origin");
const CORS_MAX_AGE = config.get("cors.maxAge");

const corsOptions = {
    origin: (ctx) => {
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
            return ctx.request.header.origin;
        }
        return CORS_ORIGINS[0];
    },
    allowHeaders: ["Accept", "Content-type", "Authorization"],
    maxAge: CORS_MAX_AGE,
};

async function logRequests(ctx, next) {
    getLogger().info(`${ctx.method} ${ctx.url}`);

    try {
        await next();
        getLogger().info(
            `${ctx.method} ${ctx.status} ${ctx.url}`
        );
    } catch (error) {
        getLogger().error(
            `${ctx.method} ${ctx.status} ${ctx.url}`,
            {
                error,
            }
        );

        throw error;
    }
}

async function handle404(ctx, next) {
        await next();

        if (ctx.status === 404) {
            ctx.status = 404;
            ctx.body = {
                code: "NOT_FOUND",
                message: `Unknown resource: ${ctx.url}`,
            };
        }
}

async function handleErrors(ctx, next) {
    try {
        await next();
    } catch (error) {
        getLogger().error("Error occured while handling a request", { error });
        let statusCode = error.status || 500;
        let errorBody = {
            code: error.code || "INTERNAL_SERVER_ERROR",
            message: error.message,
            details: error.details || {},
            stack: NODE_ENV !== "production" ? error.stack : undefined,
        };

        if (error instanceof ServiceError) {
            if (error.isValidationFailed) {
                statusCode = 400;
            }
            if (error.isUnauthorized) {
                statusCode = 401;
            }
            if (error.isForbidden) {
                statusCode = 403;
            }
            if (error.isNotFound) {
                statusCode = 404;
            }
        }

        ctx.status = statusCode;
        ctx.body = errorBody;
    }
}

module.exports = function installMiddlewares(app) {
    app.use(koaHelmet());
    app.use(koaCors(corsOptions));
    app.use(logRequests);
    app.use(bodyParser());
    app.use(handleErrors);
    app.use(handle404);
};
