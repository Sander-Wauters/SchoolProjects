module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable("BlogPost", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tag: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date: DataTypes.DATEONLY,
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
        }, {
                timestamps: false,
            });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable("BlogPost");
    },
};
