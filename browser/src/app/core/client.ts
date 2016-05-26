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
import Main = require('./main');
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
        draftMessage: Draft.Draft;
        messageId: number;
};

interface RuntimeClient {
        server: Server.RuntimeServer;
        data: Data.RuntimeData;
        messageId: number;
}

export interface SaveData {
        name: string;
        saveData: RuntimeClient;
}

export function createClientFromSaveData (
        appConfig: ConfigData.ConfigData,
        appData: AppData.AppData,
        gameData: State.Data,
        saveData: RuntimeClient): Client
{
        const profiles = gameData[appConfig.version].profiles;

        const serverSaveData = saveData.server;
        const server = Server.createServerFromSaveData(
                appConfig, gameData, serverSaveData);

        const dataSaveData = saveData.data;
        const data = Data.createDataFromSaveData(
                appData, profiles, dataSaveData);

        const folderId = data.folders[0];
        const messageId = data.messageIdsByFolderId[folderId][0] || null;
        const uiMode = appConfig.initialUIMode;
        const ui = UI.createUI(uiMode, messageId, folderId);

        return {
                server,
                data,
                ui,
                draftMessage: null,
                messageId: saveData.messageId,
        };
}

export function createClient (
        appConfig: ConfigData.ConfigData,
        appData: AppData.AppData,
        gameData: State.Data)
{
        const runtimeServer = Server.createRuntimeServer();

        const clock = Clock.createClock(appConfig.timeFactor);
        const player = PlayerData.player;
        const profilesById = gameData[appConfig.version].profiles;
        const folders = appData.folders;
        const runtimeData = Data.createRuntimeData(
                player, profilesById, folders, clock);
        const saveData: RuntimeClient = {
                server: runtimeServer,
                data: runtimeData,
                messageId: 0,
        };
        return createClientFromSaveData(
                appConfig, appData, gameData, saveData);
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
                        knownKeyIds: data.knownKeyIds,
                        clock: data.clock,
                }
        };
        return { name, saveData };
}

export function importSaveData (client: Client, importedData: SaveData)
{
        return Main.newGameFromSave(client, importedData);
}
