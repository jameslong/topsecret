import MathUtils = require('../math');
import Message = require('../message');
import MessageDelay = require('../messagedelay');
import Narrative = require('../narrative');
import Redux = require('../redux/redux');
import ReplyOption = require('../replyoption');

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
        SET_MESSAGE_END_GAME: 'SET_MESSAGE_END_GAME',
        SET_MESSAGE_ENCRYPTED: 'SET_MESSAGE_ENCRYPTED',
        SET_MESSAGE_POSITION: 'SET_MESSAGE_POSITION',
        SET_MESSAGE_CONTENT: 'SET_MESSAGE_CONTENT',
        SET_MESSAGE_FALLBACK: 'SET_MESSAGE_FALLBACK',
        SET_MESSAGE_CHILDREN: 'SET_MESSAGE_CHILDREN',
        SET_MESSAGE_REPLY_OPTIONS: 'SET_MESSAGE_REPLY_OPTIONS',
        SET_MESSAGE_SCRIPT: 'SET_MESSAGE_SCRIPT',
        SET_STRING: 'SET_STRING',
};

export interface NameValueParameters<T> {
        name: string;
        narrativeId: string;
        value: T;
}

export interface Undo extends Redux.Action<void> {}
export interface Redo extends Redux.Action<void> {}
export interface Save extends Redux.Action<void> {}
export type SetGameDataParams = Narrative.Narratives;
export interface SetGameData extends Redux.Action<SetGameDataParams> {}

export interface EndDragParams {
        id: string;
        delta: MathUtils.Coord;
        narrativeId: string;
}
export interface EndDrag extends Redux.Action<EndDragParams> {}

export type SetActiveNarrativeParams = string;
export interface SetActiveNarrative extends Redux.Action<SetActiveNarrativeParams> {}

export type OpenMessageParams = string;
export interface OpenMessage extends Redux.Action<OpenMessageParams> {}

export type CloseMessageParams = string;
export interface CloseMessage extends Redux.Action<CloseMessageParams> {}

export type CreateMessageParams = string;
export interface CreateMessage extends Redux.Action<CreateMessageParams> {}

export type DeleteMessagesParams = { names: string[]; narrativeId: string };
export interface DeleteMessages extends Redux.Action<DeleteMessagesParams> {}

export type SelectMessageParams = { name: string; narrativeId: string };
export interface SelectMessage extends Redux.Action<SelectMessageParams> {}

export type UniqueSelectMessageParams = { name: string; narrativeId: string };
export interface UniqueSelectMessage extends Redux.Action<UniqueSelectMessageParams> {}

export type DeselectMessageParams = { name: string; narrativeId: string };
export interface DeselectMessage extends Redux.Action<DeselectMessageParams> {}

export type DeselectAllMessagesParams = string;
export interface DeselectAllMessages extends Redux.Action<DeselectAllMessagesParams> {}

export type SetEditedMessageNameParams = NameValueParameters<string>;
export interface SetEditedMessageName extends Redux.Action<SetEditedMessageNameParams> {}

export type SetMessageNameParams = NameValueParameters<string>;
export interface SetMessageName extends Redux.Action<SetMessageNameParams> {}

export type SetMessageSubjectParams = NameValueParameters<string>;
export interface SetMessageSubject extends Redux.Action<SetMessageSubjectParams> {}

export type SetMessageEndGameParams = NameValueParameters<boolean>;
export interface SetMessageEndGame extends Redux.Action<SetMessageEndGameParams> {}

export type SetMessageEncryptedParams = NameValueParameters<boolean>;
export interface SetMessageEncrypted extends Redux.Action<SetMessageEncryptedParams> {}

export type SetMessageScriptParams = NameValueParameters<string>;
export interface SetMessageScript extends Redux.Action<SetMessageScriptParams> {}

export type SetMessagePositionParams = NameValueParameters<MathUtils.Coord>;
export interface SetMessagePosition extends Redux.Action<SetMessagePositionParams> {}

export type SetMessageContentParams = NameValueParameters<Message.MessageContent>;
export interface SetMessageContent extends Redux.Action<SetMessageContentParams> {}

export type SetMessageFallbackParams = NameValueParameters<MessageDelay.MessageDelay>;
export interface SetMessageFallback extends Redux.Action<SetMessageFallbackParams> {}

export type SetMessageChildrenParams = NameValueParameters<MessageDelay.MessageDelay[]>;
export interface SetMessageChildren extends Redux.Action<SetMessageChildrenParams> {}

export type SetMessageReplyOptionsParams = NameValueParameters<ReplyOption.ReplyOption[]>;
export interface SetMessageReplyOptions extends Redux.Action<SetMessageReplyOptionsParams> {}

export type SetStringParams = NameValueParameters<string>;
export interface SetString extends Redux.Action<SetStringParams> {}
