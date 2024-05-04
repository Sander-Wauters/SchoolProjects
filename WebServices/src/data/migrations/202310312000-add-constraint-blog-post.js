module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.addConstraint("BlogPost", {
            type: "foreign key",
            fields: ["username"],
            name: "fk_user_blogpost",
            references: {
                table: "User",
                field: "username",
            },
        });
        await queryInterface.addConstraint("BlogPost", {
            type: "foreign key",
            fields: ["tag"],
            name: "fk_tag_blogpost",
            references: {
                table: "Tag",
                field: "name",
            },
        });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.removeConstraint("BlogPost", "fk_user_blogpost");
        await queryInterface.removeConstraint("BlogPost", "fk_tag_blogpost");
    },
};
