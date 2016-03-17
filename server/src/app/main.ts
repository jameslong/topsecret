import App = require('./app');
import ConfigData = require('./configdata');
import Data = require('./data/data');
import Log = require('./../../../core/src/app/log/log');
import Request = require('./../../../core/src/app/requesttypes');

const config = ConfigData.config;

ConfigData.releaseMode ?
        Log.debug('RELEASE MODE') :
        Log.debug('DEBUG MODE');

Data.loadPrivateConfig(config);

App.createState(config).then(state =>
        App.init(state)
).catch(err => {
        Log.info('State warning', err);
});
