/// <reference path="../../typings/es6-polyfill/es6-polyfill.d.ts" />

// IMPORTANT: This must be included before other files for all logs to be stored
import Logging = require('./logging');
const log = Logging.log; // Required for bunyan module to be included in build

import App = require('./app');
import Config = require('./config');
import Helpers = require('../../core/src/app/utils/helpers');
import Log = require('./../../core/src/app/log');

Config.releaseMode ?
        Log.debug('RELEASE MODE') :
        Log.debug('DEBUG MODE');

const credentials = Config.loadCredentials('./');
const config = Helpers.assign(Config.config, credentials);

App.createState(config).then(state =>
        App.init(state)
).catch(err => {
        Log.error(err);
});
