import ActionCreators = require('./actioncreators');
import Arr = require('../../../../core/src/app/utils/array');
import Draft = require('../draft');
import Folder = require('../folder');
import Func = require('../../../../core/src/app/utils/function');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../../core/src/app/kbpgp');
import Map = require('../../../../core/src/app/utils/map');
import Redux = require('../redux/redux');
import Client = require('../client');
import UI = require('../ui');

// Key event action creators
export function exit (client: Client.Client)
{
        return ActionCreators.setMode(UI.Modes.INDEX_INBOX);
}

export function help (client: Client.Client)
{
        return ActionCreators.setMode(UI.Modes.HELP);
}

export function encryption (client: Client.Client)
{
        return ActionCreators.setMode(UI.Modes.ENCRYPTION);
}

export function displayMessage (client: Client.Client)
{
        return ActionCreators.displayMessage(client.ui.activeMessageId);
}

export function mail (client: Client.Client)
{
        const sender = client.data.player.email;
        return ActionCreators.composeMessage({ sender });
}

export function reply (client: Client.Client)
{
        const sender = client.data.player.email;
        const message = Client.getActiveMessage(client);
        return ActionCreators.composeReply({ sender, message });
}

export function nextMessage (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const id = client.ui.activeMessageId;
        const nextId = Arr.nextValue(messageIds, id);
        return ActionCreators.setActiveMessage(nextId);
}

export function previousMessage (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const id = client.ui.activeMessageId;
        const previousId = Arr.previousValue(messageIds, id);
        return ActionCreators.setActiveMessage(previousId);
}

export function exitHelp (client: Client.Client)
{
        const mode = client.ui.previousMode;
        return ActionCreators.setMode(mode);
}

export function encryptSend (client: Client.Client): Redux.Action<any>
{
        const messageId = Client.nextMessageId(client).toString();
        const parent = client.data.messagesById[client.draftMessage.parentId];
        const parentId = parent ? parent.id : null;
        const draftMessage = Draft.createMessageFromDraft(
                client.draftMessage, messageId);

        const keyManagersById = client.data.keyManagersById;
        const playerId = client.data.player.activeKeyId;
        const from = KbpgpHelpers.getKeyManagerById(keyManagersById, playerId);
        const to = KbpgpHelpers.getKeyManagerById(keyManagersById, draftMessage.to[0]);
        const text = draftMessage.body;

        const encryptData = { from, to, text };
        KbpgpHelpers.signEncrypt(encryptData).then(body => {
                const message = Helpers.assign(draftMessage, { body });
                const action = ActionCreators.sendMessage({ message, parentId });
                Redux.handleAction(action);
        }).catch(err => console.log(err));

        return ActionCreators.sendingMessage(true);
}

export function decrypt (client: Client.Client): Redux.Action<any>
{
        const messageId = client.ui.activeMessageId;
        const message = client.data.messagesById[messageId];
        const body = message.body;
        const keyRing = KbpgpHelpers.createKeyRing(client.data.keyManagersById);

        KbpgpHelpers.decryptVerify(keyRing, body).then(decryptedBody => {
                const action = ActionCreators.decryptMessage({
                        messageId, decryptedBody
                });
                Redux.handleAction(action);
        }).catch(err => {
                console.log(err);
                const action = ActionCreators.decryptMessage({
                        messageId,
                        decryptedBody: body
                });
                Redux.handleAction(action);
        });

        return ActionCreators.decryptingMessage(true);
}

export function folder (client: Client.Client)
{
        return ActionCreators.setMode(UI.Modes.FOLDER);
}

export function displayFolder (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const activeMessageId = messageIds.length ?
                messageIds[0] :
                null;
        const folder = client.data.foldersById[activeFolderId];
        const params = {
                folderId: activeFolderId,
                messageId: activeMessageId,
                folderType: folder.type,
        };
        return ActionCreators.displayFolder(params);
}

export function nextFolder (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const folders = client.data.folders;
        const nextId = Arr.nextValue(folders, activeFolderId);
        return ActionCreators.setActiveFolder(nextId);
}

export function previousFolder (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const folders = client.data.folders;
        const previousId = Arr.previousValue(folders, activeFolderId);
        return ActionCreators.setActiveFolder(previousId);
}

export function displayNextMessage (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const id = client.ui.activeMessageId;
        const nextId = Arr.nextValue(messageIds, id);
        return ActionCreators.displayMessage(nextId);
}

export function displayPreviousMessage (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const id = client.ui.activeMessageId;
        const previousId = Arr.previousValue(messageIds, id);
        return ActionCreators.displayMessage(previousId);
}

export function editBody (client: Client.Client)
{
        return ActionCreators.editBody(true);
}

export function editSubject (client: Client.Client)
{
        return ActionCreators.editSubject(true);
}

export function editTo (client: Client.Client)
{
        return ActionCreators.editTo(true);
}

export function setPlayerKey (client: Client.Client)
{
        const id = client.ui.activeKeyId;
        return ActionCreators.setPlayerKey(id);
}

export function nextKey (client: Client.Client)
{
        const id = client.ui.activeKeyId;
        const keyIds = client.data.keyManagers;
        const nextId = Arr.nextValue(keyIds, id);
        return ActionCreators.setActiveKey(nextId);
}

export function previousKey (client: Client.Client)
{
        const id = client.ui.activeKeyId;
        const keyIds = client.data.keyManagers;
        const previousId = Arr.previousValue(keyIds, id);
        return ActionCreators.setActiveKey(previousId);
}

export function startGenerateKey (client: Client.Client)
{
        return ActionCreators.startGenerateKey();
}

export function deleteKey (client: Client.Client)
{
        const id = client.ui.activeKeyId;
        return ActionCreators.deleteKey(id);
}

export function importKeys (client: Client.Client): Redux.Action<any>
{
        const body = Client.getActiveMessage(client).body;
        const armouredKeys = KbpgpHelpers.extractPublicKeys(body);

        KbpgpHelpers.loadPublicKeys(armouredKeys).then(instances => {
                const keyManagersById = Helpers.mapFromArray(
                        instances, KbpgpHelpers.getUserId, Func.identity);
                const action = ActionCreators.importKeys(keyManagersById)
                Redux.handleAction(action);
        }).catch(err => console.log(err));

        return null;
}
