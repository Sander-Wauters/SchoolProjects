module.exports = (sequelize, DataTypes) => 
    sequelize.define("Tag", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
    }, {
            timestamps: false,
            freezeTableName: true,
        });
