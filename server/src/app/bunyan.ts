/// <reference path='../../../typings/bunyan/bunyan.d.ts'/>
import Bunyan = require('bunyan');

export const log = Bunyan.createLogger({
        name: 'topsecret',
        streams: [
                {
                        type: 'rotating-file',
                        level: 'info',
                        path: '/var/log/topsecret.log',
                        period: '10000ms',
                        count: 3
                }
        ],
});

/*
We override global console as typescript as we cannot import a different logger
when in client/server (typescript does not support conditional imports)
*/
console.info = (data: Object) => {
        log.info({ metric: data }, 'metric');
};

console.error = (data: Object) => {
        log.error({ err: data }, 'error');
};
