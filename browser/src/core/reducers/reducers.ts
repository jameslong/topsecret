import Redux = require('../redux/redux');
import Actions = require('../actions/actions');
import Client = require('../client');
import ClientReducers = require('./clientreducers');
import UI = require('../ui');

export function reduce (
        client: Client.Client, action: Redux.Action<any>)
{
        const mappedAction = action.type === Actions.Types.KEY_DOWN ?
                mapKeyToAction(client, action) : action;

        return mappedAction ?
                ClientReducers.client(client, mappedAction) :
                client;
}

export function mapKeyToAction (client: Client.Client, action: Actions.KeyDown)
{
        const event = action.parameters;

        // DEBUG command
        if (action.parameters.keyCode === 112 /*F1*/) {
                event.preventDefault();
                return Actions.toggleDebugInfo();
        } else if (UI.isEditing(client.ui) ||
            client.ui.mode === UI.Modes.NEW_GAME_LOADING) {
                return null;
        } else {
                event.preventDefault();

                const key = event.keyCode;
                const commands = Client.getCommands(client.data, client.ui.mode);

                return commands.reduce((result, command) => {
                        return command.keyCodes.indexOf(key) !== -1 ?
                                command.actionCreator(client) :
                                result;
                        }, null);
        }
}
