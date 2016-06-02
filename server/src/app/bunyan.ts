/// <reference path='../../../typings/bunyan/bunyan.d.ts'/>
import Bunyan = require('bunyan');

export const log = Bunyan.createLogger({
        name: 'topsecret',
        streams: [
                {
                        type: 'rotating-file',
                        level: 'info',
                        path: '/var/log/topsecret.log',
                        period: '1d',
                        count: 3
                }
        ],
});

function getISOString ()
{
        const isoString = (new Date()).toISOString();
        return isoString.substring(0, 19) + '+0000';
}

/*
We override global console as typescript as we cannot import a different logger
when in client/server (typescript does not support conditional imports)
*/
console.info = (data: Object) => {
        log.info({ metric: data, time: getISOString() }, 'metric');
};

console.error = (data: Object) => {
        log.error({ err: data, time: getISOString() }, 'error');
};
