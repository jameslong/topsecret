import App = require('./TS/app');
import ConfigData = require('./config');
import Data = require('./TS/Data/data');
import Log = require('./TS/game/log/log');
import Request = require('./TS/game/requesttypes');

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
