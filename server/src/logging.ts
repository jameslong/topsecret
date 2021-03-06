/// <reference path='../../typings/bunyan/bunyan.d.ts'/>
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
        var prettyData = JSON.stringify(data, null, '    ');
        console.log('metric: %s', prettyData);
};

console.error = (err: Error, desc: string = '') => {
        const errWithStack = {
                err,
                stack: err.stack
        };
        log.error({
                err: errWithStack,
                desc,
                time: getISOString()
        }, 'error');
        var prettyData = JSON.stringify(err, null, '    ');
        console.log('error: %s', prettyData);
};
