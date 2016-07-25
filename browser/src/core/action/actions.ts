/// <reference path="../../../../typings/kbpgp/kbpgp.d.ts"/>

import Client = require('../client');
import Map = require('../../../../core/src/utils/map');
import MessageCore = require('../../../../core/src/message');
import Message = require('../message');
import Player = require('../player');
import Redux = require('../redux/redux');

export const Types = {
        BLUR: 'BLUR',
        KEY_DOWN: 'KEY_DOWN',
        SET_ACTIVE_MESSAGE: 'SET_ACTIVE_MESSAGE',
        SET_DRAFT_BODY: 'SET_DRAFT_BODY',
        SET_DRAFT_SUBJECT: 'SET_DRAFT_SUBJECT',
        SET_DRAFT_TO: 'SET_DRAFT_TO',
        DIPLAY_MESSAGE: 'DIPLAY_MESSAGE',

        TICK: 'TICK',
        TICK_FASTER: 'TICK_FASTER',
        TICK_SLOWER: 'TICK_SLOWER',
        ADD_TIME_OFFSET: 'ADD_TIME_OFFSET',

        SET_MODE: 'SET_MODE',
        COMPOSE_MESSAGE: 'COMPOSE_MESSAGE',
        COMPOSE_REPLY: 'COMPOSE_REPLY',
        RECEIVE_REPLY: 'RECEIVE_REPLY',
        SEND_MESSAGE: 'SEND_MESSAGE',
        SENDING_MESSAGE: 'SENDING_MESSAGE',
        DECRYPT_MESSAGE: 'DECRYPT_MESSAGE',
        DECRYPTING_MESSAGE: 'DECRYPTING_MESSAGE',
        SET_ACTIVE_FOLDER: 'SET_ACTIVE_FOLDER',
        DISPLAY_FOLDER: 'DISPLAY_FOLDER',
        EDIT_BODY: 'EDIT_BODY',
        END_EDIT_BODY: 'END_EDIT_BODY',
        EDIT_SUBJECT: 'EDIT_SUBJECT',
        EDIT_TO: 'EDIT_TO',

        OPEN_ATTACHMENT: 'OPEN_ATTACHMENT',

        SET_ACTIVE_KEY_INDEX: 'SET_ACTIVE_KEY_INDEX',
        IMPORT_KEYS: 'IMPORT_KEYS',

        SET_ACTIVE_LOAD_MENU_INDEX: 'SET_ACTIVE_LOAD_MENU_INDEX',
        SET_ACTIVE_MENU_INDEX: 'SET_ACTIVE_MENU_INDEX',
        SET_ACTIVE_SAVE_MENU_INDEX: 'SET_ACTIVE_SAVE_MENU_INDEX',

        IMPORT_SAVE_DATA: 'IMPORT_SAVE_DATA',
        NEW_GAME: 'NEW_GAME',
        NEW_GAME_LOGIN: 'NEW_GAME_LOGIN',
        NEW_GAME_LOADING_INFO: 'NEW_GAME_LOADING_INFO',
        SET_NEW_PLAYER_INFO: 'SET_NEW_GAME_PLAYER_INFO',
};

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

export interface Blur extends Redux.Action<void> {}
export const blur = createEmptyActionCreator(Types.BLUR);

type KeyDownParams = KeyboardEvent;
export interface KeyDown extends Redux.Action<KeyDownParams> {}
export const keyDown = createActionCreator<KeyDownParams>(Types.KEY_DOWN);

type SetActiveMessageParams = string;
export interface SetActiveMessage extends Redux.Action<SetActiveMessageParams> {}
export const setActiveMessage = createActionCreator<SetActiveMessageParams>(Types.SET_ACTIVE_MESSAGE);

type SetDraftBodyParams = string;
export interface SetDraftBody extends Redux.Action<SetDraftBodyParams> {}
export const setDraftBody = createActionCreator<SetDraftBodyParams>(Types.SET_DRAFT_BODY);

type SetDraftSubjectParams = string;
export interface SetDraftSubject extends Redux.Action<SetDraftSubjectParams> {}
export const setDraftSubject = createActionCreator<SetDraftSubjectParams>(Types.SET_DRAFT_SUBJECT);

type SetDraftToParams = string;
export interface SetDraftTo extends Redux.Action<SetDraftToParams> {}
export const setDraftTo = createActionCreator<SetDraftToParams>(Types.SET_DRAFT_TO);

type DisplayMessageParams = string;
export interface DisplayMessage extends Redux.Action<DisplayMessageParams> {}
export const displayMessage = createActionCreator<DisplayMessageParams>(Types.DIPLAY_MESSAGE);

export interface Tick extends Redux.Action<void> {}
export const tick = createEmptyActionCreator(Types.TICK);

export interface TickFaster extends Redux.Action<void> {}
export const tickFaster = createEmptyActionCreator(Types.TICK_FASTER);

export interface TickSlower extends Redux.Action<void> {}
export const tickSlower = createEmptyActionCreator(Types.TICK_SLOWER);

type AddTimeOffsetParams = number;
export interface AddTimeOffset extends Redux.Action<AddTimeOffsetParams> {}
export const addTimeOffset = createActionCreator<AddTimeOffsetParams>(Types.ADD_TIME_OFFSET);

type SetModeParams = string;
export interface SetMode extends Redux.Action<SetModeParams> {}
export const setMode = createActionCreator<SetModeParams>(Types.SET_MODE);

type SetActiveFolderParams = string;
export interface SetActiveFolder extends Redux.Action<SetActiveFolderParams> {}
export const setActiveFolder = createActionCreator<SetActiveFolderParams>(Types.SET_ACTIVE_FOLDER);

export interface EditBody extends Redux.Action<void> {}
export const editBody = createEmptyActionCreator(Types.EDIT_BODY);

export interface EndEditBody extends Redux.Action<void> {}
export const endEditBody = createEmptyActionCreator(Types.END_EDIT_BODY);

type EditSubjectParams = boolean;
export interface EditSubject extends Redux.Action<EditSubjectParams> {}
export const editSubject = createActionCreator<EditSubjectParams>(Types.EDIT_SUBJECT);

type EditToParams = boolean;
export interface EditTo extends Redux.Action<EditToParams> {}
export const editTo = createActionCreator<EditToParams>(Types.EDIT_TO);

type OpenAttachmentParams = string;
export interface OpenAttachment extends Redux.Action<OpenAttachmentParams> {}
export const openAttachment = createActionCreator<OpenAttachmentParams>(Types.OPEN_ATTACHMENT);

export interface ComposeMessageParams {
        sender: string;
}
export interface ComposeMessage extends Redux.Action<ComposeMessageParams> {}
export const composeMessage = createActionCreator<ComposeMessageParams>(Types.COMPOSE_MESSAGE);

export interface ComposeReplyParams {
        message: Message.Message;
        sender: string;
}
export interface ComposeReply extends Redux.Action<ComposeReplyParams> {}
export const composeReply = createActionCreator<ComposeReplyParams>(Types.COMPOSE_REPLY);

type ReceiveReplyParams = MessageCore.Reply;
export interface ReceiveReply extends Redux.Action<ReceiveReplyParams> {}
export const receiveReply = createActionCreator<ReceiveReplyParams>(Types.RECEIVE_REPLY);

export interface SendMessageParams {
        message: Message.Message;
        parentId: string;
}
export interface SendMessage extends Redux.Action<SendMessageParams> {}
export const sendMessage = createActionCreator<SendMessageParams>(Types.SEND_MESSAGE);

type SendingMessageParams = boolean;
export interface SendingMessage extends Redux.Action<SendingMessageParams> {}
export const sendingMessage = createActionCreator<SendingMessageParams>(Types.SENDING_MESSAGE);

export interface DecryptMessageParams {
        messageId: string;
        decryptedBody: string;
}
export interface DecryptMessage extends Redux.Action<DecryptMessageParams> {}
export const decryptMessage = createActionCreator<DecryptMessageParams>(Types.DECRYPT_MESSAGE);

type DecryptingMessageParams = boolean;
export interface DecryptingMessage extends Redux.Action<DecryptingMessageParams> {}
export const decryptingMessage = createActionCreator<DecryptingMessageParams>(Types.DECRYPTING_MESSAGE);

export interface DisplayFolderParams {
        folderId: string;
        messageId: string;
        folderType: string;
}
export interface DisplayFolder extends Redux.Action<DisplayFolderParams> {}
export const displayFolder = createActionCreator<DisplayFolderParams>(Types.DISPLAY_FOLDER);

type SetActiveKeyIndexParams = number;
export interface SetActiveKeyIndex extends Redux.Action<SetActiveKeyIndexParams> {}
export const setActiveKeyIndex = createActionCreator<SetActiveKeyIndexParams>(Types.SET_ACTIVE_KEY_INDEX);

export type ImportKeysParams = string[];
export interface ImportKeys extends Redux.Action<ImportKeysParams> {}
export const importKeys = createActionCreator<ImportKeysParams>(Types.IMPORT_KEYS);

type SetActiveLoadIndexParams = number;
export interface SetActiveLoadIndex extends Redux.Action<SetActiveLoadIndexParams> {}
export const setActiveLoadIndex = createActionCreator<SetActiveLoadIndexParams>(Types.SET_ACTIVE_LOAD_MENU_INDEX);

type SetActiveMenuIndexParams = number;
export interface SetActiveMenuIndex extends Redux.Action<SetActiveMenuIndexParams> {}
export const setActiveMenuIndex = createActionCreator<SetActiveMenuIndexParams>(Types.SET_ACTIVE_MENU_INDEX);

type SetActiveSaveIndexParams = number;
export interface SetActiveSaveIndex extends Redux.Action<SetActiveSaveIndexParams> {}
export const setActiveSaveIndex = createActionCreator<SetActiveSaveIndexParams>(Types.SET_ACTIVE_SAVE_MENU_INDEX);

type ImportSaveDataParams = Client.SaveData;
export interface ImportSaveData extends Redux.Action<ImportSaveDataParams> {}
export const importSaveData = createActionCreator<ImportSaveDataParams>(Types.IMPORT_SAVE_DATA);

type NewGameParams = Player.Player;
export interface NewGame extends Redux.Action<NewGameParams> {}
export const newGame = createActionCreator<NewGameParams>(Types.NEW_GAME);

export interface NewGameLogin extends Redux.Action<void> {}
export const newGameLogin = createEmptyActionCreator(Types.NEW_GAME_LOGIN);

type NewGameLoadingInfoParams = string;
export interface NewGameLoadingInfo extends Redux.Action<NewGameLoadingInfoParams> {}
export const newGameLoadingInfo = createActionCreator<NewGameLoadingInfoParams>(Types.NEW_GAME_LOADING_INFO);
