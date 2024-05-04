const ServiceError = require("../core/serviceError");

const handleDBError = (error) => {
    const { code = "", sqlMessage } = error.original;

    if (code === "ER_DUP_ENTRY") {
        switch (true) {
            case sqlMessage.includes("user.PRIMARY"):
                return ServiceError.validationFailed("A user with this name already exists");
            case sqlMessage.includes("tag.PRIMARY"):
                return ServiceError.validationFailed("A tag with this name already exists");
            default:
                return ServiceError.validationFailed("This item already exists");
        }
    }

    if (code.startsWith('ER_NO_REFERENCED_ROW')) {
        switch (true) {
            case sqlMessage.includes("fk_user_blogpost"):
            case sqlMessage.includes("fk_user_comment"):
            case sqlMessage.includes("fk_user_milestone"):
                return ServiceError.notFound("This user does not exist");
            case sqlMessage.includes("fk_tag_blogpost"):
            case sqlMessage.includes("fk_tag_milestone"):
                return ServiceError.notFound("This tag does not exist");
            case sqlMessage.includes("fk_blogpost_comment"):
                return ServiceError.notFound("This blog post does not exist");
        }
    }

    // Return error because we don't know what happened
    return error;
};

module.exports = handleDBError;
