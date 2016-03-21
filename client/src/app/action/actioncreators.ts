import Actions = require('./actions');
import Arr = require('../../../../core/src/app/utils/array');
import Folder = require('../folder');
import Message = require('../../../../core/src/app/message');
import Redux = require('../redux/redux');
import State = require('../state');
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

export const startGenerateKey = createEmptyActionCreator(Actions.Types.START_GENERATE_KEY);
export const generatedKey = createActionCreator<Actions.GeneratedKeyParams>(Actions.Types.GENERATED_KEY);
export const setDraftKeyName = createActionCreator<string>(Actions.Types.SET_DRAFT_KEY_NAME);
export const setDraftKeyPassphrase = createActionCreator<string>(Actions.Types.SET_DRAFT_KEY_PASSPHRASE);
export const deleteKey = createActionCreator<string>(Actions.Types.DELETE_KEY);

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
export const editBody = createActionCreator<boolean>(Actions.Types.EDIT_BODY);
export const editSubject = createActionCreator<boolean>(Actions.Types.EDIT_SUBJECT);
export const editTo = createActionCreator<boolean>(Actions.Types.EDIT_TO);

export const setPlayerKey = createActionCreator<string>(Actions.Types.SET_PLAYER_KEY);
export const setActiveKey = createActionCreator<string>(Actions.Types.SET_ACTIVE_KEY);
export const importKeys = createActionCreator<Actions.ImportKeysParams>(Actions.Types.IMPORT_KEYS);
