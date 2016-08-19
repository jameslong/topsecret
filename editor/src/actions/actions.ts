import MathUtils = require('../math');
import Message = require('../../../core/src/message');
import Narrative = require('../narrative');
import Redux = require('../redux/redux');
import ReplyOption = require('../../../core/src/replyoption');

export const Types = {
        UNDO: 'UNDO',
        REDO: 'REDO',
        SAVE: 'SAVE',
        SET_GAME_DATA: 'SET_GAME_DATA',
        END_DRAG: 'END_DRAG',
        SET_ACTIVE_NARRATIVE: 'SET_ACTIVE_NARRATIVE',
        OPEN_MESSAGE: 'OPEN_MESSAGE',
        CLOSE_MESSAGE: 'CLOSE_MESSAGE',
        CREATE_MESSAGE: 'CREATE_MESSAGE',
        DELETE_MESSAGES: 'DELETE_MESSAGES',
        SELECT_MESSAGE: 'SELECT_MESSAGE',
        UNIQUE_SELECT_MESSAGE: 'UNIQUE_SELECT_MESSAGE',
        DESELECT_MESSAGE: 'DESELECT_MESSAGE',
        DESELECT_ALL_MESSAGES: 'DESELECT_ALL_MESSAGES',
        SET_EDITED_MESSAGE_NAME: 'SET_EDITED_MESSAGE_NAME',
        SET_MESSAGE_NAME: 'SET_MESSAGE_NAME',
        SET_MESSAGE_SUBJECT: 'SET_MESSAGE_SUBJECT',
        SET_MESSAGE_BODY: 'SET_MESSAGE_BODY',
        SET_MESSAGE_START_GAME: 'SET_MESSAGE_START_GAME',
        SET_MESSAGE_END_GAME: 'SET_MESSAGE_END_GAME',
        SET_MESSAGE_ENCRYPTED: 'SET_MESSAGE_ENCRYPTED',
        SET_MESSAGE_POSITION: 'SET_MESSAGE_POSITION',
        SET_MESSAGE_CONTENT: 'SET_MESSAGE_CONTENT',
        SET_MESSAGE_FALLBACK: 'SET_MESSAGE_FALLBACK',
        SET_MESSAGE_CHILDREN: 'SET_MESSAGE_CHILDREN',
        SET_MESSAGE_REPLY_OPTIONS: 'SET_MESSAGE_REPLY_OPTIONS',
        SET_MESSAGE_ATTACHMENT: 'SET_MESSAGE_ATTACHMENT',
        SET_MESSAGE_SCRIPT: 'SET_MESSAGE_SCRIPT',
        SET_STRING: 'SET_STRING',
};

export interface NameValueParameters<T> {
        name: string;
        narrativeId: string;
        value: T;
}

function createAction<T> (type: string, parameters: T): Redux.Action<T>
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

function createEmptyActionCreator (type: string)
{
        return () => createAction(type, null);
}

export interface Undo extends Redux.Action<void> {}
export const undo = createEmptyActionCreator(Types.UNDO);

export interface Redo extends Redux.Action<void> {}
export const redo = createEmptyActionCreator(Types.REDO);

export interface Save extends Redux.Action<void> {}
export const save = createEmptyActionCreator(Types.SAVE);

export type SetGameDataParams = Narrative.Narratives;
export interface SetGameData extends Redux.Action<SetGameDataParams> {}
export const setGameData = createActionCreator<SetGameDataParams>(Types.SET_GAME_DATA);

export interface EndDragParams {
        id: string;
        delta: MathUtils.Coord;
        narrativeId: string;
}
export interface EndDrag extends Redux.Action<EndDragParams> {}
export const endDrag = createActionCreator<EndDragParams>(Types.END_DRAG);

export type SetActiveNarrativeParams = string;
export interface SetActiveNarrative extends Redux.Action<SetActiveNarrativeParams> {}
export const setActiveNarrative = createActionCreator<SetActiveNarrativeParams>(Types.SET_ACTIVE_NARRATIVE);

export type OpenMessageParams = string;
export interface OpenMessage extends Redux.Action<OpenMessageParams> {}
export const openMessage = createActionCreator<OpenMessageParams>(Types.OPEN_MESSAGE);

export type CloseMessageParams = string;
export interface CloseMessage extends Redux.Action<CloseMessageParams> {}
export const closeMessage = createActionCreator<CloseMessageParams>(Types.CLOSE_MESSAGE);

export type CreateMessageParams = string;
export interface CreateMessage extends Redux.Action<CreateMessageParams> {}
export const createMessage = createActionCreator<CreateMessageParams>(Types.CREATE_MESSAGE);

export type DeleteMessagesParams = { names: string[]; narrativeId: string };
export interface DeleteMessages extends Redux.Action<DeleteMessagesParams> {}
export const deleteMessages = createActionCreator<DeleteMessagesParams>(Types.DELETE_MESSAGES);

export type SelectMessageParams = { name: string; narrativeId: string };
export interface SelectMessage extends Redux.Action<SelectMessageParams> {}
export const selectMessage = createActionCreator<SelectMessageParams>(Types.SELECT_MESSAGE);

export type UniqueSelectMessageParams = { name: string; narrativeId: string };
export interface UniqueSelectMessage extends Redux.Action<UniqueSelectMessageParams> {}
export const uniqueSelectMessage = createActionCreator<UniqueSelectMessageParams>(Types.UNIQUE_SELECT_MESSAGE);

export type DeselectMessageParams = { name: string; narrativeId: string };
export interface DeselectMessage extends Redux.Action<DeselectMessageParams> {}
export const deselectMessage = createActionCreator<DeselectMessageParams>(Types.DESELECT_MESSAGE);

export type DeselectAllMessagesParams = string;
export interface DeselectAllMessages extends Redux.Action<DeselectAllMessagesParams> {}
export const deselectAllMessages = createActionCreator<DeselectAllMessagesParams>(Types.DESELECT_ALL_MESSAGES);

export type SetEditedMessageNameParams = NameValueParameters<string>;
export interface SetEditedMessageName extends Redux.Action<SetEditedMessageNameParams> {}
export const setEditedMessageName = createActionCreator<SetEditedMessageNameParams>(Types.SET_EDITED_MESSAGE_NAME);

export type SetMessageNameParams = NameValueParameters<string>;
export interface SetMessageName extends Redux.Action<SetMessageNameParams> {}
export const setMessageName = createActionCreator<SetMessageNameParams>(Types.SET_MESSAGE_NAME);

export type SetMessageSubjectParams = NameValueParameters<string>;
export interface SetMessageSubject extends Redux.Action<SetMessageSubjectParams> {}
export const setMessageSubject = createActionCreator<SetMessageSubjectParams>(Types.SET_MESSAGE_SUBJECT);

export type SetMessageBodyParams = NameValueParameters<string>;
export interface SetMessageBody extends Redux.Action<SetMessageBodyParams> {}
export const setMessageBody = createActionCreator<SetMessageBodyParams>(Types.SET_MESSAGE_BODY);

export type SetMessageStartGameParams = NameValueParameters<boolean>;
export interface SetMessageStartGame extends Redux.Action<SetMessageStartGameParams> {}
export const setMessageStartGame = createActionCreator<SetMessageStartGameParams>(Types.SET_MESSAGE_START_GAME);

export type SetMessageEndGameParams = NameValueParameters<boolean>;
export interface SetMessageEndGame extends Redux.Action<SetMessageEndGameParams> {}
export const setMessageEndGame = createActionCreator<SetMessageEndGameParams>(Types.SET_MESSAGE_END_GAME);

export type SetMessageEncryptedParams = NameValueParameters<boolean>;
export interface SetMessageEncrypted extends Redux.Action<SetMessageEncryptedParams> {}
export const setMessageEncrypted = createActionCreator<SetMessageEncryptedParams>(Types.SET_MESSAGE_ENCRYPTED);

export type SetMessageAttachmentParams = NameValueParameters<string>;
export interface SetMessageAttachment extends Redux.Action<SetMessageAttachmentParams> {}
export const setMessageAttachment = createActionCreator<SetMessageAttachmentParams>(Types.SET_MESSAGE_ATTACHMENT);

export type SetMessageScriptParams = NameValueParameters<string>;
export interface SetMessageScript extends Redux.Action<SetMessageScriptParams> {}
export const setMessageScript = createActionCreator<SetMessageScriptParams>(Types.SET_MESSAGE_SCRIPT);

export type SetMessagePositionParams = NameValueParameters<MathUtils.Coord>;
export interface SetMessagePosition extends Redux.Action<SetMessagePositionParams> {}
export const setMessagePosition = createActionCreator<SetMessagePositionParams>(Types.SET_MESSAGE_POSITION);

export type SetMessageContentParams = NameValueParameters<Message.Message>;
export interface SetMessageContent extends Redux.Action<SetMessageContentParams> {}
export const setMessageContent = createActionCreator<SetMessageContentParams>(Types.SET_MESSAGE_CONTENT);

export type SetMessageFallbackParams = NameValueParameters<Message.ThreadDelay>;
export interface SetMessageFallback extends Redux.Action<SetMessageFallbackParams> {}
export const setMessageFallback = createActionCreator<SetMessageFallbackParams>(Types.SET_MESSAGE_FALLBACK);

export type SetMessageChildrenParams = NameValueParameters<Message.ThreadDelay[]>;
export interface SetMessageChildren extends Redux.Action<SetMessageChildrenParams> {}
export const setMessageChildren = createActionCreator<SetMessageChildrenParams>(Types.SET_MESSAGE_CHILDREN);

export type SetMessageReplyOptionsParams = NameValueParameters<ReplyOption.ReplyOption[]>;
export interface SetMessageReplyOptions extends Redux.Action<SetMessageReplyOptionsParams> {}
export const setMessageReplyOptions = createActionCreator<SetMessageReplyOptionsParams>(Types.SET_MESSAGE_REPLY_OPTIONS);

export type SetStringParams = NameValueParameters<string>;
export interface SetString extends Redux.Action<SetStringParams> {}
export const setString = createActionCreator<SetStringParams>(Types.SET_STRING);
