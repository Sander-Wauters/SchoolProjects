const userService = require("../service/user");

async function requireAuthentication(ctx, next) {
    const { authorization } = ctx.headers;
    const { authToken, ...session } = await userService.checkAndParseSession(authorization);

    ctx.state.session = session;
    ctx.state.authToken = authToken;

    return next();
}

const makeRequireRole = (requiredRole) => async (ctx, next) => {
    const { role } = ctx.state.session;

    userService.checkRole(requiredRole, role); 
    return next(); 
}

module.exports = {
    requireAuthentication,
    makeRequireRole,
};
