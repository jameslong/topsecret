import Actions = require('./action/actions');
import AppData = require('./data/appdata');
import Clock = require('../../../core/src/clock');
import Command = require('./command');
import ConfigData = require('./data/config');
import Data = require('./data');
import Draft = require('./draft');
import Folder = require('./folder');
import Func = require('../../../core/src/utils/function');
import Helpers = require('../../../core/src/utils/helpers');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../core/src/kbpgp');
import Map = require('../../../core/src/utils/map');
import Main = require('./main');
import Message = require('../../../core/src/message');
import Player = require('./player');
import Profile = require('../../../core/src/profile');
import Redux = require('./redux/redux');
import Server = require('./server');
import State = require('../../../core/src/gamestate');
import UI = require('./ui');

export interface Client {
        server: Server.Server;
        data: Data.Data;
        ui: UI.UI;
        draftMessage: Draft.Draft;
        messageId: number;
        openFile: (path: string) => void;
        openExternal: (path: string) => void;
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
        settings: ConfigData.GameSettings,
        appData: AppData.AppData,
        gameData: State.NarrativeStates,
        openFile: (path: string) => void,
        openExternal: (path: string) => void,
        saveData: RuntimeClient): Client
{
        const profiles = gameData[settings.version].profiles;

        const serverSaveData = saveData.server;
        const server = Server.createServerFromSaveData(
                settings, gameData, serverSaveData);

        const dataSaveData = saveData.data;
        const data = Data.createDataFromSaveData(
                appData, profiles, dataSaveData);

        const folderId = data.folders[0];
        const messageId = data.messageIdsByFolderId[folderId][0] || null;
        const uiMode = settings.initialUIMode;
        const ui = UI.createUI(uiMode, messageId, folderId);

        return {
                server,
                data,
                ui,
                draftMessage: null,
                messageId: saveData.messageId,
                openFile,
                openExternal,
        };
}

export function createClient (
        settings: ConfigData.GameSettings,
        appData: AppData.AppData,
        gameData: State.NarrativeStates,
        player: Player.Player,
        openFile: (path: string) => void,
        openExternal: (path: string) => void)
{
        const runtimeServer = Server.createRuntimeServer();

        const clock = Clock.createClock(settings.timeFactor);
        const profilesById = gameData[settings.version].profiles;
        const folders = appData.folders;
        const runtimeData = Data.createRuntimeData(
                player, profilesById, folders, clock);
        const saveData: RuntimeClient = {
                server: runtimeServer,
                data: runtimeData,
                messageId: 0,
        };
        return createClientFromSaveData(
                settings, appData, gameData, openFile, openExternal, saveData);
}

export function tickClient ()
{
        const action = Actions.tick();
        Redux.handleAction(action);
}

export function nextMessageId (client: Client, from: string)
{
        const id = (client.messageId + 1);
        return Message.createMessageId(from, id);
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
