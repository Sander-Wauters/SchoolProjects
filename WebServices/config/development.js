module.exports = {
    port: 9000,
    log: {
        level: 'silly',
        disabled: false,
    },
    cors: {
        origin: ["http://localhost:5173"],
        maxAge: 3 * 60 * 60,
    },
};
