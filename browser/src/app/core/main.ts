/// <reference path="../../../../typings/es6-polyfill/es6-polyfill.d.ts" />

import AppData = require('./data/appdata');
import ConfigData = require('./data/config');
import MessageData = require('./data/messages');
import CommandData = require('./data/commands');
import PlayerData = require('./data/player');
import MenuData = require('./data/menuitems');

import Client = require('./client');
import Clock = require('../../../../core/src/app/clock');
import Data = require('./data');
import EventHandler = require('./eventhandler');
import KbpgpHelpers = require('../../../../core/src/app/kbpgp');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Prom = require('../../../../core/src/app/utils/promise');
import Reducers = require('./action/reducers');
import Redux = require('./redux/redux');
import Root = require('./component/smart/root');
import Server = require('./server');
import State = require('../../../../core/src/app/state');
import UI = require('./ui');

export function init (gameData: State.Data, openFile: (path: string) => void)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                menuItems: MenuData.items,
                folders: MessageData.folders,
        };
        return appInit(appConfig, appData, gameData, openFile);
}
export function appInit (
        appConfig: ConfigData.ConfigData,
        appData: AppData.AppData,
        gameData: State.Data,
        openFile: (path: string) => void)
{
        const wrapper = document.getElementById('wrapper');

        const client = Client.createClient(
                appConfig, appData, gameData, openFile);

        const getClient = Redux.init(client, Reducers.reduce, Root, wrapper);
        Redux.render(client, Root, wrapper);

        EventHandler.addKeyHandlers();

        const clock = client.data.clock;
        const player = client.data.player;
        const server = client.server;
        return Server.beginGame(player, appConfig, server, clock).then(result =>
                startTick(getClient)
        );
}

export function newGame (client: Client.Client)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                menuItems: MenuData.items,
                folders: MessageData.folders,
        };
        const newClient = Client.createClient(
                appConfig, appData, client.server.app.data, client.openFile);
        const player = newClient.data.player;

        const server = newClient.server;
        const clock = newClient.data.clock;
        Server.beginGame(player, appConfig, server, clock);

        return newClient;
}

export function newGameFromSave (
        client: Client.Client, saveData: Client.SaveData)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                menuItems: MenuData.items,
                folders: MessageData.folders,
        };
        const gameData = client.server.app.data;
        const openFile = client.openFile;

        const newClient = Client.createClientFromSaveData(
                appConfig, appData, gameData, openFile, saveData.saveData);
        const newUI = Helpers.assign(newClient.ui,
                { mode: UI.Modes.INDEX_INBOX });
        return Helpers.assign(newClient, { ui: newUI });
}

function tick (getClient: () => Client.Client)
{
        Client.tickClient();

        const client = getClient();
        const server = client.server;
        const clock = client.data.clock;
        return Server.tickServer(server, clock);
}

export function startTick (getClient: () => Client.Client)
{
        const update = () => tick(getClient);
        const intervalMs = 1000;
        Prom.loop(intervalMs, update);
}
