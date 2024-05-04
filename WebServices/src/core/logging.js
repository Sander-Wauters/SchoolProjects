const config = require("config");
const winston = require("winston");
const { combine, timestamp, colorize, printf } = winston.format;

let rootLogger;

const getLogger = () => {
    if (!rootLogger)
        throw new Error("Logger not initialized");
    return rootLogger;
};

const loggerFormat = () => {
    const formatMessage = ({ level, message, timestamp, name="server", ...rest }) => 
        `${timestamp} ${name} ${level} ${message} ${JSON.stringify(rest)}`;

    const formatError = ({ error: {stack}, ...rest }) => 
        `${formatMessage(rest)}\n\n${stack}\n`;

    const format = (info) =>
        info.error instanceof Error ? formatError(info) : formatMessage(info);
    

    return combine(colorize(), timestamp(), printf(format));
};

const initializeLogger = ({ level, disabled=false, defaultMeta = {} }) => {
    rootLogger = winston.createLogger({
        level,
        format: loggerFormat(),
        defaultMeta,
        transports: config.get("env") == "test" ? [
            new winston.transports.File({
                filename: "tests.log",
            }),
        ] : [
                new winston.transports.Console({
                    silent: disabled,
                }),
            ],
    });

    return rootLogger;
};

module.exports = {
    initializeLogger,
    getLogger,
};
