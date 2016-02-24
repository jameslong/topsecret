import Logger = require('./logger');

const debug = console.log;
const info = console.info;
const error = console.error;
const assert = (test: boolean, desc: string, meta?: Object) => {
        if (test) {
                error(desc, meta);
        }
};


export = { debug, info, error, assert };
