import winston from 'winston';
import {utilities as nestWinstonModuleUtilities} from 'nest-winston';
import 'winston-daily-rotate-file';

const configTransport = {
    dirname: 'logs/',
    filename: 'log-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
};

const transport = new winston.transports.DailyRotateFile(configTransport);

export const winstonLoggerConfig = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({timestamp, level, message}) =>
                `${timestamp} [${level.toUpperCase()}] ${message}`,
        ),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
            ),
        }),
        transport,
    ],
});
