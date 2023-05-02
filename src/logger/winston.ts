import * as winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';

const { transports, format } = winston;
const { combine, printf } = format;
const logTime = new Date().toLocaleDateString();
const customLog = printf(({ level, message }) => {
  return `${level}: LogTime: [${logTime}] Message:-[${message}]`;
});

const date = new Date();
const newdate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

const options = {
  info: {
    level: 'info',
    dirname: 'logs/combibned',
    json: true,
    handleExceptions: true,
    datePattern: 'YYYY-MM-DD-HH',
    filename: `combined-${newdate}.log`,
  },
  error: {
    level: 'error',
    dirname: 'logs/error',
    json: true,
    handleExceptions: true,
    filename: `error-${newdate}.log`,
  },
  console: {
    level: 'debug',
    json: false,
    handleExceptions: true,
    format: combine(winston.format.colorize(), customLog),
  },
};

const combinedTransports = [
  new transports.File(options.info),
  new transports.File(options.error),
  new transports.Console(options.console),
];

export default {
  format: combine(customLog),
  transports:
    process.env.NODE_ENV !== 'production'
      ? combinedTransports
      : [
          new WinstonCloudWatch({
            name: process.env.PROJECT_NAME + ' Logs',
            logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
            logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
            awsAccessKeyId: process.env.AWS_ACCESS_KEY,
            awsSecretKey: process.env.AWS_KEY_SECRET,
            awsRegion: process.env.CLOUDWATCH_AWS_REGION,
            messageFormatter: function (item) {
              return `${item.level}: ${item.message}`;
            },
          }),
          ...combinedTransports,
        ],
};
