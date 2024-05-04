"use strict";

const fs = require("fs");
const path = require("path");
const config = require("../../../config/database")[process.env.NODE_ENV];
const Sequelize = require("sequelize");
const { getLogger } = require("../../core/logging");
const { exec } = require("child_process");

const db = {};
let sequelize;

async function runMigrations() {
    return new Promise((resolve, reject) => {
        const migrate = exec(
            "npx sequelize-cli db:migrate",
            {env: process.env},
            err => (err ? reject(err): resolve())
        );

        // Forward stdout+stderr to this process
        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
    });
}

function createAssociations() {
    db.User.hasMany(db.BlogPost, { foreignKey: "username" });
    db.User.hasMany(db.Milestone, { foreignKey: "username" });
    db.User.hasMany(db.Comment, { foreignKey: "username" });

    db.Tag.hasMany(db.BlogPost, { foreignKey: "tag" });
    db.Tag.hasMany(db.Milestone, { foreignKey: "tag" });

    db.Milestone.belongsTo(db.User, { foreignKey: "username" });

    db.BlogPost.hasMany(db.Comment, { foreignKey: "postId" });
    db.BlogPost.belongsTo(db.User, { foreignKey: "username" });
    db.BlogPost.belongsTo(db.Tag, { foreignKey: "tag" });
    
    db.Comment.belongsTo(db.User, { foreignKey: "username" });
    db.Comment.belongsTo(db.User, { foreignKey: "postId" });
}

async function initializeData() {
    await runMigrations();

    sequelize = new Sequelize(
        config.database,
        config.username, 
        config.password, {
            host: config.host, 
            port: config.port,
            dialect: config.dialect,
            logging: (msg) => getLogger().info(msg),
        });

    await sequelize.authenticate();

    fs.readdirSync(__dirname)
        .filter(file => {
            return (
                file.indexOf('.') !== 0 &&
                    file !== "index.js" &&
                    file.slice(-3) === ".js" &&
                    file.indexOf(".test.js") === -1
            );
        })
        .forEach(file => {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });

    createAssociations();

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
}

async function shutdownData() {
    const logger = getLogger();
    logger.info("Shutting down database connection");

    await sequelize.close();
    sequelize = null;

    logger.info("Database connection shut down");
}

module.exports = {
    db,
    initializeData,
    shutdownData,
};
