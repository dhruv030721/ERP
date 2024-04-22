import winston, { format } from "winston";

const {combine, timestamp, prettyPrint, printf, errors} = format;

const logger = winston.createLogger({
    transports : [new winston.transports.Console()],
})


export default logger;