import winston, { format, transports, createLogger } from "winston";
import * as dotenv from "dotenv";
dotenv.config();

const { combine, timestamp, label, printf, prettyPrint, json } = format;
const PrintFormat = printf(({ level, message, label, timestamp }) => {
  return `${level} ${timestamp} ${label} ${message}`;
});

/**
 * @description Server Sent Events. Storing server logs on server.
 * @see {@link https://github.com/winstonjs/winston}
 * @see {@link https://blog.appsignal.com/2021/09/01/best-practices-for-logging-in-nodejs.html}
 */
export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    label({ label: process.env.NODE_ENV }),
    PrintFormat

    // Alternative (1)
    // format.splat(),
    // format.simple(),

    // Alternative (2)
    // label({ label: 'right meow!' }),
    // timestamp(),
    // prettyPrint()
  ),
  // format: winston.format.json(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: "public/logs/error.log", level: "error" }),
    new transports.File({
      filename: "public/logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: "public/logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "public/logs/rejections.log" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
