import ActionCreators = require('./action/actioncreators');
import Command = require('./command');
import ConfigData = require('./data/config');
import Data = require('./data');
import Draft = require('./draft');
import Folder = require('./folder');
import Func = require('../../../../core/src/app/utils/function');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../../core/src/app/kbpgp');
import Map = require('../../../../core/src/app/utils/map');
import Message = require('./message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('./player');
import PlayerData = require('./data/player');
import Redux = require('./redux/redux');
import Server = require('./server');
import State = require('../../../../core/src/app/state');
import UI = require('./ui');

export interface Client {
        server: Server.Server
        data: Data.Data;
        ui: UI.UI;
        draftKey: KbpgpHelpers.KeyData;
        draftMessage: Draft.Draft;
        messageId: number;
};

export function createClient (
        config: ConfigData.ConfigData,
        playerData: PlayerData.PlayerData,
        data: State.Data,
        server: Server.Server,
        commands: Command.Command[],
        commandIdsByMode: Data.IdsById,
        folders: Folder.FolderData[])
{
        const player = {
                email: playerData.email,
                activeKeyId: playerData.email,
        };
        return loadGameKeys(data, config, playerData).then(keyManagersById => {
                return createClientFromData(
                        server,
                        player,
                        commands,
                        commandIdsByMode,
                        folders,
                        keyManagersById);
        });
}

function loadGameKeys (
        data: State.Data,
        config: ConfigData.ConfigData,
        player: PlayerData.PlayerData)
{
        const domain = config.emailDomain;
        const profiles = data[config.version].profiles;
        const profileKeyData = Helpers.arrayFromMap(profiles, profile => {
                const friendlyEmail = MessageHelpers.generateFriendlyEmail(
                        profile, domain);
                return {
                        id: friendlyEmail,
                        key: profile.publicKey,
                };
        });
        const playerKeyData = {
                id: player.email,
                key: player.privateKey,
                passphrase: player.passphrase,
        };
        const keyData = profileKeyData.concat([playerKeyData]);
        return KbpgpHelpers.loadFromKeyData(keyData);
}

export function createClientFromData (
        server: Server.Server,
        player: Player.Player,
        commands: Command.Command[],
        commandIdsByMode: Data.IdsById,
        folders: Folder.FolderData[],
        keyManagersById: Map.Map<Kbpgp.KeyManagerInstance>): Client
{
        const data = Data.createData(
                folders,
                commands,
                commandIdsByMode,
                player,
                keyManagersById);

        const folderId = data.folders[0];
        const keyId = player.activeKeyId;
        const messageId: string = null;
        const ui = UI.createUI(
                UI.Modes.INDEX_INBOX, messageId, folderId, keyId);

        return {
                server,
                data,
                ui,
                draftKey: null,
                draftMessage: null,
                messageId: 0,
        };
}

export function tickClient ()
{
        const action = ActionCreators.tick();
        Redux.handleAction(action);
}

export function nextMessageId (client: Client, from: string)
{
        const id = (client.messageId + 1);
        return MessageHelpers.createMessageId(from, id);
}

export function getActiveMessage (client: Client)
{
        const activeMessageId = client.ui.activeMessageId;
        return client.data.messagesById[activeMessageId];
}
export function getActiveFolder (client: Client)
{
        const activeFolderId = client.ui.activeFolderId;
        return client.data.foldersById[activeFolderId];
}

export function getActiveCommands (client: Client)
{
        return getCommands(client.data, client.ui.mode);
}

export function getCommands (data: Data.Data, mode: string)
{
        const commandsById = data.commandsById;
        const commandIds = data.commandIdsByMode[mode];
        return commandIds.map(id => commandsById[id]);
}

export function getActiveMessages (client: Client)
{
        return getMessages(client.data, client.ui.activeFolderId);
}

export function getMessages (data: Data.Data, folderId: string)
{
        const messageIds = data.messageIdsByFolderId[folderId];
        return messageIds.map(id => data.messagesById[id]);
}
