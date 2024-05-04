module.exports = (sequelize, DataTypes) => 
    sequelize.define("Comment", {
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
        dateCreated: DataTypes.STRING,
        dateLastChanged: DataTypes.STRING,
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
            timestamps: false,
            freezeTableName: true,
        });
