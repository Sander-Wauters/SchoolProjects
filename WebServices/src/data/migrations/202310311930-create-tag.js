module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable("Tag", {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
        }, {
                timestamps: false
            });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable("Tag");
    },
};
