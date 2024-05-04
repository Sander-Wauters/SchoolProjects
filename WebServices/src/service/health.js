const config = require("config");
const packageJson = require("../../package.json");

const ping = () => ({
    pong: true,
});

const getVersion = () => ({
    env: config.get("env"),
    version: packageJson.version,
    name: packageJson.name,
});

module.exports = {
    ping,
    getVersion,
};
