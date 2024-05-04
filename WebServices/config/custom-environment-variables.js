module.exports = {
    env: "NODE_ENV",
    port: "PORT",
    host: "DATABASE_HOST",
    database: {
        port: "DATABASE_PORT",
        name: "DATABASE_NAME",
        username: "DATABASE_USERNAME",
        password: "DATABASE_PASSWORD",
    },
    auth: {
        jwt: {
            secret: "AUTH_JWT_SECRET",
        },
    },
};
