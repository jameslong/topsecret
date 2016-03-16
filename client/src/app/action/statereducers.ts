import Actions = require('./actions');
import Data = require('../data');
import DataReducers = require('./datareducers');
import DraftReducers = require('./draftreducers');
import DraftKeyReducers = require('./draftkeyreducers');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Redux = require('../redux/redux');
import State = require('../state');
import UIReducers = require('./uireducers');

export function state (state: State.State, action: Redux.Action<any>)
{
        let temp = state;

        switch (action.type) {
                case Actions.Types.DELETE_KEY:
                        const deleteKey = <Actions.DeleteKey><any>action;
                        temp = handleDeleteKey(temp, deleteKey);

                default:
                        break;
        }

        return stateReducer(temp, action);
}

export function stateReducer (state: State.State, action: Redux.Action<any>)
{
        return {
                data: DataReducers.data(state.data, action),
                ui: UIReducers.ui(state.ui, action),
                draftKey: DraftKeyReducers.draftKey(state.draftKey, action),
                draftMessage: DraftReducers.draft(state.draftMessage, action),
                messageId: messageId(state.messageId, action),
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

function handleDeleteKey (state: State.State, action: Actions.DeleteKey)
{
        const id = action.parameters;
        const data = Data.deleteKey(state.data, id);

        const activeKeyId = id === state.ui.activeKeyId ?
                data.keyManagers[0] : state.ui.activeKeyId;
        const ui = Helpers.assign(state.ui, { activeKeyId });

        return Helpers.assign(state, { data, ui });
}
