const Joi = require("joi").extend(require("@joi/date"));
const Router = require("@koa/router");
const Roles = require("../core/roles");
const { requireAuthentication } = require("../core/auth");
const validate = require("../core/validation");
const userService = require("../service/user");

async function getAllUsers(ctx) {
    ctx.body = await userService.getAll();
}
getAllUsers.validationScheme = null;

async function getUserByUsername(ctx) {
    ctx.body = await userService.getByUsername(ctx.params.username);
}
getUserByUsername.validationScheme = {
    params: {
        username: Joi.string().max(255),
    },
};

async function deleteUserByUsername(ctx) {
    await userService.deleteByUsername(ctx.params.username);
    ctx.status = 204;
}
deleteUserByUsername.validationScheme = {
    params: {
        username: Joi.string().max(255),
    },
};

async function login(ctx) {
    const { username, password } = ctx.request.body;
    const token = await userService.login(username, password);
    ctx.body = token;
}
login.validationScheme = {
    body: {
        username: Joi.string().max(255),
        password: Joi.string().max(255),
    },
};

async function register(ctx) {
    const token = await userService.register(ctx.request.body);
    ctx.body = token;
}
register.validationScheme = {
    body: {
        username: Joi.string().max(255),
        email: Joi.string().email(),
        password: Joi.string().min(8).max(255),
    },
};

function checkUsername(ctx, next) {
    const { username: sessionUsername, role } = ctx.state.session;
    const { username } = ctx.params;

    // You can only get your own data unless you're an admin
    if (sessionUsername !== username && role !== Roles.ADMIN) {
        return ctx.throw(403, "You are not allowed to view this part of the application", { code: "FORBIDDEN" });
    }
    return next();
}

module.exports = (app) => {
    const router = new Router({
        prefix: "/users",
    });

    router.post("/login", validate(login.validationScheme), login);
    router.post("/register", validate(register.validationScheme), register);

    // Only returns the username and role.
    // The blog posts already display the username so no need secure to the get requests.
    router.get("/", requireAuthentication, validate(getAllUsers.validationScheme), getAllUsers);
    router.get("/:username", requireAuthentication, validate(getUserByUsername.validationScheme), checkUsername, getUserByUsername);

    router.delete("/:username", requireAuthentication, validate(deleteUserByUsername.validationScheme), checkUsername, deleteUserByUsername);

    app.use(router.routes()).use(router.allowedMethods());
}
