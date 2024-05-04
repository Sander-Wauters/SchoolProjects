module.exports = {
    auth: {
        argon: {
            saltLength: 16,
            hashLength: 32,
            timeCost: 6,
            memoryCost: 2 ** 17, // 128 MiB
        },
        jwt: {
            expirationInterval: 60 * 60 * 1000, // ms (1 hour)
            issuer: "2324-webservices-SanderWauters.be",
            audience: "2324-webservices-SanderWauters.be",
        },
    },
};
