import Actions = require('./actions');
import Data = require('../data');
import DataReducers = require('./datareducers');
import DraftReducers = require('./draftreducers');
import DraftKeyReducers = require('./draftkeyreducers');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Redux = require('../redux/redux');
import Client = require('../client');
import UIReducers = require('./uireducers');

export function client (client: Client.Client, action: Redux.Action<any>)
        : Client.Client
{
        let temp = client;

        switch (action.type) {
                case Actions.Types.DELETE_KEY:
                        const deleteKey = <Actions.DeleteKey><any>action;
                        temp = handleDeleteKey(temp, deleteKey);
                        break;

                default:
                        break;
        }

        return clientReducer(temp, action);
}

export function clientReducer (client: Client.Client, action: Redux.Action<any>)
{
        return {
                server: client.server,
                data: DataReducers.data(client.data, action),
                ui: UIReducers.ui(client.ui, action),
                draftKey: DraftKeyReducers.draftKey(client.draftKey, action),
                draftMessage: DraftReducers.draft(client.draftMessage, action),
                messageId: messageId(client.messageId, action),
        };
}

export function messageId (messageId: number, action: Redux.Action<any>)
{
        switch (action.type) {
                case Actions.Types.SEND_MESSAGE:
                        return messageId + 1;
                default:
                        return messageId;
        }
}

function handleDeleteKey (client: Client.Client, action: Actions.DeleteKey)
{
        const id = action.parameters;
        const data = Data.deleteKey(client.data, id);

        const activeKeyId = id === client.ui.activeKeyId ?
                data.keyManagers[0] : client.ui.activeKeyId;
        const ui = Helpers.assign(client.ui, { activeKeyId });

        return Helpers.assign(client, { data, ui });
}
