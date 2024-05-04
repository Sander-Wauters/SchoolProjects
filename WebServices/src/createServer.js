const Koa = require("koa");
const config = require("config");
const installMiddlewares = require("./core/installMiddlewares");
const installRest = require("./rest");
const { initializeLogger, getLogger } = require("./core/logging");
const { initializeData, shutdownData } = require("./data/models");

const NODE_ENV = config.get("env");
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

module.exports = async function createServer() {
    initializeLogger({
        level: LOG_LEVEL,
        disabled: LOG_DISABLED,
        defaultMeta: {
            NODE_ENV,
        },
    });

    await initializeData();

    const app = new Koa();
    installMiddlewares(app);
    installRest(app);

    return {
        getApp() {
            return app;
        },
        async start() {
            const port = config.get("port");
            return new Promise((resolve) => {
                app.listen(port, () => {
                    getLogger().info(`Server listening on http://localhost:${port}`);
                    resolve();
                });
            });
        },
        async stop() {
            app.removeAllListeners();
            await shutdownData();
            getLogger().info("Server stopped");
        }
    };
};
