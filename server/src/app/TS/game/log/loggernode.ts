/// <reference path='../../../typings/winston/winston.d.ts'/>

import Logger = require('./logger');
import winston = require('winston');

function createWinstonLogger ()
{
        const transports = [
                new (winston.transports.File)({
                        name: 'info-file',
                        filename: 'info.log',
                        level: 'info',
                        maxFiles: 1,
                        maxsize: 10000000,
                        timestamp: false,
                }),
                new (winston.transports.File)({
                        name: 'error-file',
                        filename: 'error.log',
                        level: 'error',
                        maxFiles: 1,
                        maxsize: 10000000,
                        handleExceptions: true,
                        timestamp: false,
                }),
                new (winston.transports.Console)({
                        level: 'silly',
                        timestamp: false,
                })
        ];

        return new (winston.Logger)({ transports });
}

const winstonLogger = createWinstonLogger();

const info = winstonLogger.info;
const debug = winstonLogger.debug;
const error = function (desc: string, meta?: Object)
{
        winstonLogger.error(desc, meta);
        throw error;
}
const assert = function (test: boolean, desc: string, meta?: Object)
{
        if (!test) {
                error(desc, meta);
        }
};

export = { debug, info, error, assert };
