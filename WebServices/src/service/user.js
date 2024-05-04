const { db } = require("../data/models");
const { hashPassword, verifyPassword } = require("../core/password");
const { generateJWT, verifyJWT } = require("../core/jwt");
const { getLogger } = require("../core/logging");
const ServiceError = require("../core/serviceError");
const Roles = require("../core/roles");
const handleDBError = require("./_handleDBError");

function makeExposedUser({ username, role }) {
    return { username, role };
}

// TODO: Find a better name for this.
function makeExposedUserWithEmail({ username, email, role }) {
    return { username, email, role };
}

async function makeLoginData(user) {
    const token = await generateJWT(user);
    return { user: makeExposedUser(user), token };
}

async function checkAndParseSession(authHeader) {
    if (!authHeader) {
        throw ServiceError.unauthorized("You need to be signed in");
    } 

    if (!authHeader.startsWith("Bearer ")) {
        throw ServiceError.unauthorized("Invalid authentication token");
    }

    const authToken = authHeader.substring(7);
    try {
        const { username, role } = await verifyJWT(authToken); 

        // TODO: aangemelde gebruiker ophalen en teruggeven
        return { username, role, authToken };
    } catch (error) {
        getLogger().error(error.message, { error });
        throw ServiceError.unauthorized(error.message);
    }
}

function checkRole(requiredRole, role) {
    if (requiredRole !== role) {
        throw ServiceError.forbidden("You are not allowed to view this part of the application");
    }
}

async function getAll() {
    const users = await db.User.findAll();
    return users.map(makeExposedUser);
}

async function getByUsername(username) {
    const user = await db.User.findByPk(username);
    if (!user) {
        throw ServiceError.notFound(`No user with username ${username} exists`, { username });
    }

    return makeExposedUserWithEmail(user);
}

async function deleteByUsername(username) {
    const existingUser = await db.User.findByPk(username);
    if (!existingUser) {
        throw ServiceError.notFound(`No user with username ${username} exists`, { username });
    }

    // We do NOT want to cascade delete a user so we first replace all 
    // references to this user with a placeholder and then we delete the user.
    // Why, if for some reason the admin (At time of writing the only user that can create blog posts and milestones.) 
    // gets deleted, would mean that about 90% of the database will get removed as well.
    const placeholder = await db.User.findByPk("deleted_user");
    if (!placeholder) {
        await db.User.create({ username: "deleted_user", role: "user", email: "deleted_user@mail.com", passwordHash: "tryToGenerateThisHash" })
    }

    try {  
        await db.Comment.update(
            { username: "deleted_user" }, 
            { where: { username }
            });
        await db.BlogPost.update(
            { username: "deleted_user" },
            { where: { username }
            });
        await db.Milestone.update(
            { username: "deleted_user" },
            { where: { username }
            });

        await db.User.destroy({ where: { username }});
    } catch (error) {
        throw handleDBError(error);
    }
}

async function login(username, password) {
    const user = await db.User.findByPk(username);
    if (!user) {
        throw ServiceError.unauthorized("The given username and password do not match");
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
        throw ServiceError.unauthorized("The given username and password do not match");
    }

    return await makeLoginData(user);
}

async function register({ username, email, password }) {
    try {
        const passwordHash = await hashPassword(password);
        const newUser = await db.User.create({ username, role: Roles.USER, email, passwordHash });

        return await makeLoginData(newUser);
    } catch (error) {
        throw handleDBError(error);
    }
}

module.exports = {
    checkRole,
    checkAndParseSession,
    getAll,
    getByUsername,
    deleteByUsername,
    login,
    register,
};
