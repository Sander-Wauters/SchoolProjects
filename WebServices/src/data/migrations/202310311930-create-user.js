module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable("User", {
            username: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
                timestamps: false
            });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable("User");
    },
};
