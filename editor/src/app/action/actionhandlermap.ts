import ActionHandlers = require('./actionhandlers');
import Actions = require('./actions');
import Redux = require('../redux/redux');
import State = require('../state');

export interface ActionHandler<T, U> {
        (state: U, action: Redux.Action<T>): U
}

interface HandlerMap {
        [s: string]: ActionHandler<any, State.State>;
}

export const handlerMap: HandlerMap = {
        [Actions.Types.UNDO]: ActionHandlers.handleUndo,
        [Actions.Types.REDO]: ActionHandlers.handleRedo,
        [Actions.Types.SAVE]: ActionHandlers.handleSave,
        [Actions.Types.SET_GAME_DATA]: ActionHandlers.handleSetGameData,
        [Actions.Types.END_DRAG]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleEndDrag),
        [Actions.Types.SET_ACTIVE_NARRATIVE]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetActiveNarrative),
        [Actions.Types.OPEN_MESSAGE]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleOpenMessage),
        [Actions.Types.CLOSE_MESSAGE]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleCloseMessage),
        [Actions.Types.CREATE_MESSAGE]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleCreateMessage),
        [Actions.Types.DELETE_MESSAGE]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleDeleteMessage),
        [Actions.Types.SELECT_MESSAGE]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSelectMessage),
        [Actions.Types.UNIQUE_SELECT_MESSAGE]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleUniqueSelectMessage),
        [Actions.Types.DESELECT_MESSAGE]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleDeselectMessage),
        [Actions.Types.DESELECT_ALL_MESSAGES]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleDeselectAllMessages),
        [Actions.Types.SET_EDITED_MESSAGE_NAME]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetEditedMessageName),
        [Actions.Types.SET_MESSAGE_NAME]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageName),
        [Actions.Types.SET_MESSAGE_SUBJECT]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageSubject),
        [Actions.Types.SET_MESSAGE_END_GAME]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageEndGame),
        [Actions.Types.SET_MESSAGE_ENCRYPTED]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageEncrypted),
        [Actions.Types.SET_MESSAGE_SCRIPT]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageScript),
        [Actions.Types.SET_MESSAGE_POSITION]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessagePosition),
        [Actions.Types.SET_MESSAGE_CONTENT]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageContent),
        [Actions.Types.SET_MESSAGE_FALLBACK]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageFallback),
        [Actions.Types.SET_MESSAGE_CHILDREN]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageChildren),
        [Actions.Types.SET_MESSAGE_REPLY_OPTIONS]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetMessageReplyOptions),
        [Actions.Types.SET_STRING]: ActionHandlers.wrapStoreUpdateFunc(ActionHandlers.handleSetString),
};

export function handleNewAction (
        state: State.State, action: Redux.Action<any>)
{
        return handlerMap[action.type](state, action);
}
