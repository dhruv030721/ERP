import { format, createLogger, transports } from 'winston';
import { DateTime } from 'luxon';

const { combine, timestamp, label, printf, prettyPrint } = format;

const timezoned = () => {
    return DateTime.now()
        .setZone('Asia/Kolkata')
        .toFormat('dd-MM-yyyy HH:mm:ss');
};

// Using the printf format.
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp}  ${level}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp({ format: timezoned }),
        prettyPrint(),
        customFormat
    ),
    transports: [
        new transports.Console(),
        // new transports.File({ filename: 'error.log', level: 'error' }),
        // new transports.File({ filename: 'server.log' }),
    ],
});

export default logger;
