module.exports = (sequelize, DataTypes) => 
    sequelize.define("Milestone", {
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
        accomplished: DataTypes.BOOLEAN,
        imagePath: DataTypes.STRING,
        title: DataTypes.STRING,
        content: DataTypes.TEXT
    }, {
            timestamps: false,
            freezeTableName: true,
        });
