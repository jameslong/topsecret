///<reference path='../im/state.ts'/>
///<reference path='actions.ts'/>

module Action {
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
                return (parameters: NameValueParameters<T>) =>
                        createAction(type, parameters);
        }

        function createEmptyActionCreator (type: string)
        {
                return () => createAction(type, null);
        }

        export const undo = createEmptyActionCreator(Types.UNDO);
        export const redo = createEmptyActionCreator(Types.REDO);
        export const save = createEmptyActionCreator(Types.SAVE);
        export const setGameData = createActionCreator<Im.Narratives>(Types.SET_GAME_DATA);

        export const endDrag = createActionCreator<EndDragParameters>(Types.END_DRAG);
        export const setActiveNarrative = createActionCreator<string>(Types.SET_ACTIVE_NARRATIVE);
        export const openMessage = createActionCreator<string>(Types.OPEN_MESSAGE);
        export const closeMessage = createEmptyActionCreator(Types.CLOSE_MESSAGE);
        export const createMessage = createEmptyActionCreator(Types.CREATE_MESSAGE);
        export const deleteMessage = createActionCreator<string>(Types.DELETE_MESSAGE);
        export const selectMessage = createActionCreator<string>(Types.SELECT_MESSAGE);
        export const uniqueSelectMessage = createActionCreator<string>(Types.UNIQUE_SELECT_MESSAGE);
        export const deselectMessage = createActionCreator<string>(Types.DESELECT_MESSAGE);
        export const deselectAllMessages = createEmptyActionCreator(Types.DESELECT_ALL_MESSAGES);

        export const setEditedMessageName = createNameValueActionCreator<string>(Types.SET_EDITED_MESSAGE_NAME);
        export const setMessageName = createNameValueActionCreator(Types.SET_MESSAGE_NAME);
        export const setMessageSubject = createNameValueActionCreator<string>(Types.SET_MESSAGE_SUBJECT);
        export const setMessageEndGame = createNameValueActionCreator<boolean>(Types.SET_MESSAGE_END_GAME);
        export const setMessageEncrypted = createNameValueActionCreator<boolean>(Types.SET_MESSAGE_ENCRYPTED);
        export const setMessageScript = createNameValueActionCreator<string>(Types.SET_MESSAGE_SCRIPT);
        export const setMessagePosition = createNameValueActionCreator<Im.Coord>(Types.SET_MESSAGE_POSITION);
        export const setMessageContent = createNameValueActionCreator<Im.MessageContent>(Types.SET_MESSAGE_CONTENT);
        export const setMessageFallback = createNameValueActionCreator<Im.MessageDelay>(Types.SET_MESSAGE_FALLBACK);
        export const setMessageChildren = createNameValueActionCreator<Immutable.List<Im.MessageDelay>>(Types.SET_MESSAGE_CHILDREN);
        export const setMessageReplyOptions = createNameValueActionCreator<Immutable.List<Im.ReplyOption>>(Types.SET_MESSAGE_REPLY_OPTIONS);

        export const setString = createNameValueActionCreator<string>(Types.SET_STRING);
}
