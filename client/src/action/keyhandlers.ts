import ActionCreators = require('./actioncreators');
import Arr = require('../utils/array');
import Draft = require('../draft');
import Folder = require('../folder');
import Helpers = require('../utils/helpers');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../kbpgp');
import Map = require('../map/map');
import Redux = require('../redux/redux');
import State = require('../state');
import UI = require('../ui');

// Key event action creators
export function exit (state: State.State)
{
        return ActionCreators.setMode(UI.Modes.INDEX_INBOX);
}

export function help (state: State.State)
{
        return ActionCreators.setMode(UI.Modes.HELP);
}

export function encryption (state: State.State)
{
        return ActionCreators.setMode(UI.Modes.ENCRYPTION);
}

export function displayMessage (state: State.State)
{
        return ActionCreators.displayMessage(state.ui.activeMessageId);
}

export function mail (state: State.State)
{
        const sender = state.data.player.email;
        return ActionCreators.composeMessage({ sender });
}

export function reply (state: State.State)
{
        const sender = state.data.player.email;
        const message = State.getActiveMessage(state);
        return ActionCreators.composeReply({ sender, message });
}

export function nextMessage (state: State.State)
{
        const activeFolderId = state.ui.activeFolderId;
        const messageIds = state.data.messageIdsByFolderId[activeFolderId];
        const id = state.ui.activeMessageId;
        const nextId = Arr.nextValue(messageIds, id);
        return ActionCreators.setActiveMessage(nextId);
}

export function previousMessage (state: State.State)
{
        const activeFolderId = state.ui.activeFolderId;
        const messageIds = state.data.messageIdsByFolderId[activeFolderId];
        const id = state.ui.activeMessageId;
        const previousId = Arr.previousValue(messageIds, id);
        return ActionCreators.setActiveMessage(previousId);
}

export function exitHelp (state: State.State)
{
        const mode = state.ui.previousMode;
        return ActionCreators.setMode(mode);
}

export function encryptSend (state: State.State): Redux.Action<any>
{
        const messageId = State.nextMessageId(state).toString();
        const parent = state.data.messagesById[state.draftMessage.parentId];
        const parentId = parent ? parent.id : null;
        const draftMessage = Draft.createMessageFromDraft(
                state.draftMessage, messageId);

        const keyManagersById = state.data.keyManagersById;
        const playerId = state.data.player.activeKeyId;
        const from = KbpgpHelpers.getKeyManagerById(keyManagersById, playerId);
        const to = KbpgpHelpers.getKeyManagerById(keyManagersById, draftMessage.to[0]);

        KbpgpHelpers.signEncrypt(from, to, draftMessage.body, (err, body) => {
                if (err) {
                        console.log('Encryption/signing error: ', err);
                }

                const message = Helpers.assign(draftMessage, { body });
                const action = ActionCreators.sendMessage({ message, parentId });
                setTimeout(() => Redux.handleAction(action), 750);
        });

        return ActionCreators.sendingMessage(true);
}

export function decrypt (state: State.State): Redux.Action<any>
{
        const messageId = state.ui.activeMessageId;
        const message = state.data.messagesById[messageId];
        const body = message.body;
        const keyRing = KbpgpHelpers.createKeyRing(state.data.keyManagersById);

        KbpgpHelpers.decryptVerify(keyRing, body, (err, decryptedBody) => {
                if (err) {
                        console.log('Decryption/verification error:', err);
                        decryptedBody = body;
                }

                const action = ActionCreators.decryptMessage({
                        messageId, decryptedBody
                });
                setTimeout(() => Redux.handleAction(action), 750);
        });

        return ActionCreators.decryptingMessage(true);
}

export function folder (state: State.State)
{
        return ActionCreators.setMode(UI.Modes.FOLDER);
}

export function displayFolder (state: State.State)
{
        const activeFolderId = state.ui.activeFolderId;
        const messageIds = state.data.messageIdsByFolderId[activeFolderId];
        const activeMessageId = messageIds.length ?
                messageIds[0] :
                null;
        const folder = state.data.foldersById[activeFolderId];
        const params = {
                folderId: activeFolderId,
                messageId: activeMessageId,
                folderType: folder.type,
        };
        return ActionCreators.displayFolder(params);
}

export function nextFolder (state: State.State)
{
        const activeFolderId = state.ui.activeFolderId;
        const folders = state.data.folders;
        const nextId = Arr.nextValue(folders, activeFolderId);
        return ActionCreators.setActiveFolder(nextId);
}

export function previousFolder (state: State.State)
{
        const activeFolderId = state.ui.activeFolderId;
        const folders = state.data.folders;
        const previousId = Arr.previousValue(folders, activeFolderId);
        return ActionCreators.setActiveFolder(previousId);
}

export function displayNextMessage (state: State.State)
{
        const activeFolderId = state.ui.activeFolderId;
        const messageIds = state.data.messageIdsByFolderId[activeFolderId];
        const id = state.ui.activeMessageId;
        const nextId = Arr.nextValue(messageIds, id);
        return ActionCreators.displayMessage(nextId);
}

export function displayPreviousMessage (state: State.State)
{
        const activeFolderId = state.ui.activeFolderId;
        const messageIds = state.data.messageIdsByFolderId[activeFolderId];
        const id = state.ui.activeMessageId;
        const previousId = Arr.previousValue(messageIds, id);
        return ActionCreators.displayMessage(previousId);
}

export function editBody (state: State.State)
{
        return ActionCreators.editBody(true);
}

export function editSubject (state: State.State)
{
        return ActionCreators.editSubject(true);
}

export function editTo (state: State.State)
{
        return ActionCreators.editTo(true);
}

export function setPlayerKey (state: State.State)
{
        const id = state.ui.activeKeyId;
        return ActionCreators.setPlayerKey(id);
}

export function nextKey (state: State.State)
{
        const id = state.ui.activeKeyId;
        const keyIds = state.data.keyManagers;
        const nextId = Arr.nextValue(keyIds, id);
        return ActionCreators.setActiveKey(nextId);
}

export function previousKey (state: State.State)
{
        const id = state.ui.activeKeyId;
        const keyIds = state.data.keyManagers;
        const previousId = Arr.previousValue(keyIds, id);
        return ActionCreators.setActiveKey(previousId);
}

export function startGenerateKey (state: State.State)
{
        return ActionCreators.startGenerateKey();
}

export function deleteKey (state: State.State)
{
        const id = state.ui.activeKeyId;
        return ActionCreators.deleteKey(id);
}

export function importKeys (state: State.State): Redux.Action<any>
{
        const body = State.getActiveMessage(state).body;
        const armouredKeys = KbpgpHelpers.extractPublicKeys(body);
        KbpgpHelpers.loadPublicKeys(armouredKeys, (err, instances) => {
                const keyManagersById = Helpers.mapFromArray(
                        instances, KbpgpHelpers.getUserId, Helpers.identity);
                const action = ActionCreators.importKeys(keyManagersById)
                Redux.handleAction(action);
        });

        return null;
}
