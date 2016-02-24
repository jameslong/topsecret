import App = require('./app');
import ConfigData = require('./configdata');
import Data = require('./data/data');
import Log = require('./../../../game/log/log');
import Request = require('./../../../game/requesttypes');

var config = ConfigData.config;

if (ConfigData.releaseMode) {
        Log.debug('RELEASE MODE');
} else {
        Log.debug('DEBUG MODE');
}

Data.loadPrivateConfig(config);

var onLoadState = (error: Request.Error, state: App.State) =>
        {
                if (error) {
                        Log.info('State warning', error);
                }

                App.init(state);
        };
App.createState(config, onLoadState);
