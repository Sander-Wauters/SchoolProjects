module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.addConstraint("Comment", {
            type: "foreign key",
            fields: ["postId"],
            name: "fk_blogpost_comment",
            references: {
                table: "BlogPost",
                field: "id",
            },
        });
        await queryInterface.addConstraint("Comment", {
            type: "foreign key",
            fields: ["username"],
            name: "fk_user_comment",
            references: {
                table: "User",
                field: "username",
            },
        });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.removeConstraint("Comment", "fk_blogpost_comment");
        await queryInterface.removeConstraint("Comment", "fk_user_comment");
    },
};
