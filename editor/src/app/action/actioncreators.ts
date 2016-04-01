///<reference path='../state.ts'/>
///<reference path='actions.ts'/>

module ActionCreators {
        function createAction<T> (type: string, parameters: T): Flux.Action<T>
        {
                return {
                        type: type,
                        parameters: parameters,
                };
        }

        function createActionCreator<T> (type: string)
        {
                return (parameters: T) => createAction(type, parameters);
        }

        function createNameValueActionCreator<T> (type: string)
        {
                return (parameters: Actions.NameValueParameters<T>) =>
                        createAction(type, parameters);
        }

        function createEmptyActionCreator (type: string)
        {
                return () => createAction(type, null);
        }

        export const undo = createEmptyActionCreator(Actions.Types.UNDO);
        export const redo = createEmptyActionCreator(Actions.Types.REDO);
        export const save = createEmptyActionCreator(Actions.Types.SAVE);
        export const setGameData = createActionCreator<Im.Narratives>(Actions.Types.SET_GAME_DATA);

        export const endDrag = createActionCreator<Actions.EndDragParameters>(Actions.Types.END_DRAG);
        export const setActiveNarrative = createActionCreator<string>(Actions.Types.SET_ACTIVE_NARRATIVE);
        export const openMessage = createActionCreator<string>(Actions.Types.OPEN_MESSAGE);
        export const closeMessage = createEmptyActionCreator(Actions.Types.CLOSE_MESSAGE);
        export const createMessage = createEmptyActionCreator(Actions.Types.CREATE_MESSAGE);
        export const deleteMessage = createActionCreator<string>(Actions.Types.DELETE_MESSAGE);
        export const selectMessage = createActionCreator<string>(Actions.Types.SELECT_MESSAGE);
        export const uniqueSelectMessage = createActionCreator<string>(Actions.Types.UNIQUE_SELECT_MESSAGE);
        export const deselectMessage = createActionCreator<string>(Actions.Types.DESELECT_MESSAGE);
        export const deselectAllMessages = createEmptyActionCreator(Actions.Types.DESELECT_ALL_MESSAGES);

        export const setEditedMessageName = createNameValueActionCreator<string>(Actions.Types.SET_EDITED_MESSAGE_NAME);
        export const setMessageName = createNameValueActionCreator(Actions.Types.SET_MESSAGE_NAME);
        export const setMessageSubject = createNameValueActionCreator<string>(Actions.Types.SET_MESSAGE_SUBJECT);
        export const setMessageEndGame = createNameValueActionCreator<boolean>(Actions.Types.SET_MESSAGE_END_GAME);
        export const setMessageEncrypted = createNameValueActionCreator<boolean>(Actions.Types.SET_MESSAGE_ENCRYPTED);
        export const setMessageScript = createNameValueActionCreator<string>(Actions.Types.SET_MESSAGE_SCRIPT);
        export const setMessagePosition = createNameValueActionCreator<Im.Coord>(Actions.Types.SET_MESSAGE_POSITION);
        export const setMessageContent = createNameValueActionCreator<Im.MessageContent>(Actions.Types.SET_MESSAGE_CONTENT);
        export const setMessageFallback = createNameValueActionCreator<Im.MessageDelay>(Actions.Types.SET_MESSAGE_FALLBACK);
        export const setMessageChildren = createNameValueActionCreator<Immutable.List<Im.MessageDelay>>(Actions.Types.SET_MESSAGE_CHILDREN);
        export const setMessageReplyOptions = createNameValueActionCreator<Immutable.List<Im.ReplyOption>>(Actions.Types.SET_MESSAGE_REPLY_OPTIONS);

        export const setString = createNameValueActionCreator<string>(Actions.Types.SET_STRING);
}
