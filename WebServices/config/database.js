// Need this file for sequelize-cli
module.exports = {
    production: {
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: "mysql",
    },
    development: {
        username: "root",
        password: "Server2022",
        database: "webservice",
        host: "localhost",
        port: 3306,
        dialect: "mysql",
    },
    test: {
        username: "root",
        password: "Server2022",
        database: "webserviceTests",
        host: "localhost",
        port: 3306,
        dialect: "mysql",
    },
};
