import ActionCreators = require('./action/actioncreators');
import AppData = require('./data/appdata');
import Clock = require('../../../../core/src/app/clock');
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
import Profile = require('../../../../core/src/app/profile');
import Redux = require('./redux/redux');
import Server = require('./server');
import State = require('../../../../core/src/app/state');
import UI = require('./ui');

export interface Client {
        server: Server.Server;
        data: Data.Data;
        ui: UI.UI;
        draftKey: KbpgpHelpers.KeyData;
        draftMessage: Draft.Draft;
        messageId: number;
};

export interface SaveData {
        name: string;
        saveData: {
                server: Server.RuntimeServer;
                data: Data.RuntimeData;
                messageId: number;
        };
}

export function createClient (
        appConfig: ConfigData.ConfigData,
        appData: AppData.AppData,
        profiles: Map.Map<Profile.Profile>,
        player: Player.Player,
        server: Server.Server,
        clock: Clock.Clock)
{
        return createClientFromData(
                appConfig,
                appData,
                profiles,
                server,
                clock,
                player);
}

function loadGameKeys (
        data: State.Data, config: ConfigData.ConfigData, player: Player.Player)
{
        const domain = config.emailDomain;
        const profiles = data[config.version].profiles;
        const profileKeyData = Helpers.arrayFromMap(profiles, profile => {
                return {
                        id: profile.email,
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
        appConfig: ConfigData.ConfigData,
        appData: AppData.AppData,
        profiles: Map.Map<Profile.Profile>,
        server: Server.Server,
        clock: Clock.Clock,
        player: Player.Player): Client
{
        const data = Data.createData(appData, profiles, player, clock);
        const folderId = data.folders[0];
        const messageId: string = null;
        const uiMode = appConfig.initialUIMode;
        const ui = UI.createUI(uiMode, messageId, folderId);

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

export function getSaveData (client: Client, name: string): SaveData
{
        const data = client.data;
        const server = client.server;
        const saveData = {
                server: {
                        lastEvaluatedKey: server.lastEvaluatedKey,
                        db: server.db,
                        id: server.id,
                },
                messageId: client.messageId,
                data: {
                        player: data.player,
                        messagesById: data.messagesById,
                        messageIdsByFolderId: data.messageIdsByFolderId,
                        clock: data.clock,
                }
        };
        return { name, saveData };
}

export function importSaveData (client: Client, importedData: SaveData)
{
        const saveData = importedData.saveData;
        const server = Helpers.assign(client.server, saveData.server);
        const data = Helpers.assign(client.data, saveData.data);
        const messageId = saveData.messageId;
        return Helpers.assign(client, { server, data, messageId });
}
