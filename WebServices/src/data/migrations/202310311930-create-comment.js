module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable("Comment", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dateCreated: DataTypes.DATEONLY,
            dateLastChanged: DataTypes.DATEONLY,
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        }, {
                timestamps: false,
            });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable("Comment");
    },
};
