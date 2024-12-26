import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const winstonLoggerConfig = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ timestamp, level, message }) =>
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
        new winston.transports.File({
            filename: `logs/${new Date().toISOString().split('T')[0]}.log`,
            level: 'info',
        }),
    ],
});
