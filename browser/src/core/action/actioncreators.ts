import Actions = require('./actions');
import Arr = require('../../../../core/src/utils/array');
import Client = require('../client');
import Folder = require('../folder');
import Message = require('../../../../core/src/message');
import Player = require('../player');
import Redux = require('../redux/redux');
import UI = require('../ui');

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

export const blur = createEmptyActionCreator(Actions.Types.BLUR);
export const keyDown = createActionCreator<KeyboardEvent>(Actions.Types.KEY_DOWN);
export const setActiveMessage = createActionCreator<string>(Actions.Types.SET_ACTIVE_MESSAGE);
export const setDraftBody = createActionCreator<string>(Actions.Types.SET_DRAFT_BODY);
export const setDraftSubject = createActionCreator<string>(Actions.Types.SET_DRAFT_SUBJECT);
export const setDraftTo = createActionCreator<string>(Actions.Types.SET_DRAFT_TO);
export const displayMessage = createActionCreator<string>(Actions.Types.DIPLAY_MESSAGE);

export const tick = createEmptyActionCreator(Actions.Types.TICK);
export const tickFaster = createEmptyActionCreator(Actions.Types.TICK_FASTER);
export const tickSlower = createEmptyActionCreator(Actions.Types.TICK_SLOWER);
export const addTimeOffset = createActionCreator<number>(Actions.Types.ADD_TIME_OFFSET);

export const setMode = createActionCreator<string>(Actions.Types.SET_MODE);
export const composeMessage = createActionCreator<Actions.ComposeMessageParams>(Actions.Types.COMPOSE_MESSAGE);
export const composeReply = createActionCreator<Actions.ComposeReplyParams>(Actions.Types.COMPOSE_REPLY);
export const receiveReply = createActionCreator<Message.Reply>(Actions.Types.RECEIVE_REPLY);
export const sendMessage = createActionCreator<Actions.SendMessageParams>(Actions.Types.SEND_MESSAGE);
export const sendingMessage = createActionCreator<boolean>(Actions.Types.SENDING_MESSAGE);
export const decryptMessage = createActionCreator<Actions.DecryptMessageParams>(Actions.Types.DECRYPT_MESSAGE);
export const decryptingMessage = createActionCreator<boolean>(Actions.Types.DECRYPTING_MESSAGE);
export const setActiveFolder = createActionCreator<string>(Actions.Types.SET_ACTIVE_FOLDER);
export const displayFolder = createActionCreator<Actions.DisplayFolderParams>(Actions.Types.DISPLAY_FOLDER);
export const editBody = createEmptyActionCreator(Actions.Types.EDIT_BODY);
export const endEditBody = createEmptyActionCreator(Actions.Types.END_EDIT_BODY);
export const editSubject = createActionCreator<boolean>(Actions.Types.EDIT_SUBJECT);
export const editTo = createActionCreator<boolean>(Actions.Types.EDIT_TO);

export const openAttachment = createActionCreator<string>(Actions.Types.OPEN_ATTACHMENT);

export const setActiveKeyIndex = createActionCreator<number>(Actions.Types.SET_ACTIVE_KEY_INDEX);
export const importKeys = createActionCreator<Actions.ImportKeysParams>(Actions.Types.IMPORT_KEYS);

export const setActiveLoadIndex = createActionCreator<number>(Actions.Types.SET_ACTIVE_LOAD_MENU_INDEX);
export const setActiveMenuIndex = createActionCreator<number>(Actions.Types.SET_ACTIVE_MENU_INDEX);
export const setActiveSaveIndex = createActionCreator<number>(Actions.Types.SET_ACTIVE_SAVE_MENU_INDEX);

export const importSaveData = createActionCreator<Client.SaveData>(Actions.Types.IMPORT_SAVE_DATA);
export const newGame = createActionCreator<Player.Player>(Actions.Types.NEW_GAME);
export const newGameLogin = createEmptyActionCreator(Actions.Types.NEW_GAME_LOGIN);
export const newGameLoadingInfo = createActionCreator<string>(Actions.Types.NEW_GAME_LOADING_INFO);
