import ActionCreators = require('./actioncreators');
import Arr = require('../../../../core/src/app/utils/array');
import Clock = require('../clock');
import Data = require('../data');
import Draft = require('../draft');
import Folder = require('../folder');
import Func = require('../../../../core/src/app/utils/function');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../../core/src/app/kbpgp');
import Map = require('../../../../core/src/app/utils/map');
import MessageCore = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import PromisesReply = require('../../../../core/src/app/promisesreply');
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
        const draft = client.draftMessage;
        const id = Client.nextMessageId(client, draft.content.from);
        const parent = client.data.messagesById[client.draftMessage.parentId];
        const inReplyToId = parent ? parent.id : null;

        const reply = Draft.createReplyFromDraft(draft, id, inReplyToId);
        const strippedBody = MessageHelpers.stripBody(reply.body);
        const strippedReply = Helpers.assign(reply, { body: strippedBody });
        const data = client.data;
        const encryptData = Data.createReplyEncryptData(strippedReply, data);

        KbpgpHelpers.signEncrypt(encryptData).then(body => {
                const timestampMs = Clock.gameTimeMs(client.data.clock);
                const encryptedReply = Helpers.assign(reply, { body });
                const app = client.server.app;
                return PromisesReply.handleReplyMessage(
                        encryptedReply,
                        timestampMs,
                        app.data,
                        app.promises).then(result => reply)
        }).then(reply => {
                const message = Draft.createMessageFromReply(reply);
                const action = ActionCreators.sendMessage({
                        message, parentId: inReplyToId });
                Redux.handleAction(action);
        }).catch(err => console.log(err));

        return ActionCreators.sendingMessage(true);
}

export function decrypt (client: Client.Client): Redux.Action<any>
{
        const messageId = client.ui.activeMessageId;
        const message = client.data.messagesById[messageId];
        const body = message.body;
        const keyManagersById = client.data.keyManagersById;
        const keyManagers = <Kbpgp.KeyManagerInstance[]>Helpers.arrayFromMap(
                keyManagersById);
        const keyRing = KbpgpHelpers.createKeyRing(keyManagers);

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

export function tickFaster (client: Client.Client)
{
        return ActionCreators.tickFaster();
}

export function tickSlower (client: Client.Client)
{
        return ActionCreators.tickSlower();
}
