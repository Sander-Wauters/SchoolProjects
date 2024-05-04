module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.addConstraint("Milestone", {
            type: "foreign key",
            fields: ["username"],
            name: "fk_user_milestone",
            references: {
                table: "User",
                field: "username",
            },
        });
        await queryInterface.addConstraint("Milestone", {
            type: "foreign key",
            fields: ["tag"],
            name: "fk_tag_milestone",
            references: {
                table: "Tag",
                field: "name",
            },
        });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.removeConstraint("Milestone", "fk_user_milestone");
        await queryInterface.removeConstraint("Milestone", "fk_tag_milestone");
    },
};
