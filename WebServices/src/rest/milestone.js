const Joi = require("joi").extend(require("@joi/date"));
const Router = require("@koa/router");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Roles = require("../core/roles");
const validate = require("../core/validation");
const milestoneService = require("../service/milestone");
const userService = require("../service/user");

async function getAllMilestones(ctx) {
    ctx.body = await milestoneService.getAll();
}
getAllMilestones.validationScheme = null;

async function createMilestone(ctx) {
    const { username } = await userService.checkAndParseSession(ctx.headers.authorization);
    const newMilestone = await milestoneService.create({ username, ...ctx.request.body });
    ctx.status = 201;
    ctx.body = newMilestone;
}
createMilestone.validationScheme = {
    body: {
        tag: Joi.string().max(255),
        imagePath: Joi.string().max(255),
        accomplished: Joi.boolean(),
        title: Joi.string().max(255),
        content: Joi.string(),
    },
};

async function updateMilestoneById(ctx) {
    const { username } = await userService.checkAndParseSession(ctx.headers.authorization);
    const newMilestone = await milestoneService.updateById(ctx.params.id, { username, ...ctx.request.body });
    ctx.body = newMilestone;
}
updateMilestoneById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
    body: {
        tag: Joi.string().max(255),
        accomplished: Joi.boolean(),
        imagePath: Joi.string().max(255),
        title: Joi.string().max(255),
        content: Joi.string(),
    },
}

async function deleteMilestoneById(ctx) {
    await milestoneService.deleteById(ctx.params.id);
    ctx.status = 204;
}
deleteMilestoneById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

module.exports = (app) => {
    const router = new Router({
        prefix: "/milestones",
    });

    const requireAdmin = makeRequireRole(Roles.ADMIN);

    router.get("/", validate(getAllMilestones.validationScheme), getAllMilestones);

    router.post("/", requireAuthentication, validate(createMilestone.validationScheme), requireAdmin, createMilestone);
    router.put("/:id", requireAuthentication, validate(updateMilestoneById.validationScheme), requireAdmin, updateMilestoneById);
    router.delete("/:id", requireAuthentication, validate(deleteMilestoneById.validationScheme), requireAdmin, deleteMilestoneById);

    app.use(router.routes()).use(router.allowedMethods());
};
