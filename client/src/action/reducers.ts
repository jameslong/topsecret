import Redux = require('../redux/redux');
import Actions = require('./actions');
import State = require('../state');
import StateReducers = require('./statereducers');
import UI = require('../ui');

export function reduce (
        state: State.State, action: Redux.Action<any>)
{
        const mappedAction = action.type === Actions.Types.KEY_DOWN ?
                mapKeyToAction(state, action) : action;

        return mappedAction ?
                StateReducers.state(state, mappedAction) :
                state;
}

export function mapKeyToAction (state: State.State, action: Actions.KeyDown)
{
        if (UI.isEditing(state.ui)) {
                return null;
        }

        const event = action.parameters;
        event.preventDefault(); // We only do this if not editing

        const key = event.keyCode;
        const commands = State.getCommands(state.data, state.ui.mode);

        return commands.reduce((result, command) => {
                return command.keyCodes.indexOf(key) !== -1 ?
                        command.actionCreator(state) :
                        result;
                }, null);
}
