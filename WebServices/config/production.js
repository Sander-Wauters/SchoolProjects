module.exports = {
    log: {
        level: 'info',
        disabled: false,
    },
    cors: {
        origin: ["http://localhost:5173", "https://two324-frontendweb-sanderwauters.onrender.com"],
        maxAge: 3 * 60 * 60,
    },
};
