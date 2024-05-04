module.exports = (sequelize, DataTypes) => 
    sequelize.define("User", {
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
            timestamps: false,
            freezeTableName: true,
        });
