import Config = require('../config');
import DataReducers = require('./datareducers');
import Redux = require('../redux/redux');
import State = require('../state');
import UIReducers = require('./uireducers');

export function store (
        state: State.Store, config: Config.Config, action: Redux.Action<any>)
{
        return State.Store({
                data: DataReducers.data(state.data, config, action),
                ui: UIReducers.ui(state.ui, config, action),
        });
}
