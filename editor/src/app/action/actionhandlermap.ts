///<reference path='actions.ts'/>
///<reference path='actionhandlers.ts'/>
///<reference path='actioncreators.ts'/>

module Action {
        export interface ActionHandler<T, U> {
                (state: U, action: Flux.Action<T>): U
        }

        interface HandlerMap {
                [s: string]: ActionHandler<any, Im.State>;
        }

        export const handlerMap: HandlerMap = {
                [Types.UNDO]: handleUndo,
                [Types.REDO]: handleRedo,
                [Types.SAVE]: handleSave,
                [Types.SET_GAME_DATA]: handleSetGameData,
                [Types.END_DRAG]: wrapStoreUpdateFunc(handleEndDrag),
                [Types.SET_ACTIVE_NARRATIVE]: wrapStoreUpdateFunc(handleSetActiveNarrative),
                [Types.OPEN_MESSAGE]: wrapStoreUpdateFunc(handleOpenMessage),
                [Types.CLOSE_MESSAGE]: wrapStoreUpdateFunc(handleCloseMessage),
                [Types.CREATE_MESSAGE]: wrapStoreUpdateFunc(handleCreateMessage),
                [Types.DELETE_MESSAGE]: wrapStoreUpdateFunc(handleDeleteMessage),
                [Types.SELECT_MESSAGE]: wrapStoreUpdateFunc(handleSelectMessage),
                [Types.UNIQUE_SELECT_MESSAGE]: wrapStoreUpdateFunc(handleUniqueSelectMessage),
                [Types.DESELECT_MESSAGE]: wrapStoreUpdateFunc(handleDeselectMessage),
                [Types.DESELECT_ALL_MESSAGES]: wrapStoreUpdateFunc(handleDeselectAllMessages),
                [Types.SET_EDITED_MESSAGE_NAME]: wrapStoreUpdateFunc(handleSetEditedMessageName),
                [Types.SET_MESSAGE_NAME]: wrapStoreUpdateFunc(handleSetMessageName),
                [Types.SET_MESSAGE_SUBJECT]: wrapStoreUpdateFunc(handleSetMessageSubject),
                [Types.SET_MESSAGE_END_GAME]: wrapStoreUpdateFunc(handleSetMessageEndGame),
                [Types.SET_MESSAGE_ENCRYPTED]: wrapStoreUpdateFunc(handleSetMessageEncrypted),
                [Types.SET_MESSAGE_POSITION]: wrapStoreUpdateFunc(handleSetMessagePosition),
                [Types.SET_MESSAGE_CONTENT]: wrapStoreUpdateFunc(handleSetMessageContent),
                [Types.SET_MESSAGE_FALLBACK]: wrapStoreUpdateFunc(handleSetMessageFallback),
                [Types.SET_MESSAGE_CHILDREN]: wrapStoreUpdateFunc(handleSetMessageChildren),
                [Types.SET_MESSAGE_REPLY_OPTIONS]: wrapStoreUpdateFunc(handleSetMessageReplyOptions),
                [Types.SET_STRING]: wrapStoreUpdateFunc(handleSetString),
        };

        export function handleNewAction (
                state: Im.State, action: Flux.Action<any>)
        {
                return handlerMap[action.type](state, action);
        }
}
