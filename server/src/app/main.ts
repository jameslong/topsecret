/// <reference path="../../../typings/es6-polyfill/es6-polyfill.d.ts" />

// IMPORTANT: This must be included before other files for all logs to be stored
import Bunyan = require('./bunyan');
const log = Bunyan.log; // Required for bunyan module to be included in build

import App = require('./app');
import Config = require('./config');
import ConfigData = require('./configdata');
import Log = require('./../../../core/src/app/log');
import Request = require('./../../../core/src/app/requesttypes');

const config = ConfigData.config;

ConfigData.releaseMode ?
        Log.debug('RELEASE MODE') :
        Log.debug('DEBUG MODE');

const credentials = Config.loadCredentials('./');
Object.assign(config.aws, credentials.aws);
Object.assign(config.mailgun, credentials.mailgun);

App.createState(config).then(state =>
        App.init(state)
).catch(err => {
        Log.error(err);
});
