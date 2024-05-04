module.exports = (sequelize, DataTypes) => 
    sequelize.define("BlogPost", {
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
        date: DataTypes.STRING,
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
    }, {
            timestamps: false,
            freezeTableName: true,
        });
