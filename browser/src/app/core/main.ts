/// <reference path="../../../../typings/es6-polyfill/es6-polyfill.d.ts" />

import AppData = require('./data/appdata');
import ConfigData = require('./data/config');
import MessageData = require('./data/messages');
import CommandData = require('./data/commands');
import PlayerData = require('./data/player');

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
import Player = require('./player');
import UI = require('./ui');

export function init (
        gameData: State.Data,
        openFile: (path: string) => void,
        openExternal: (path: string) => void)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                folders: MessageData.folders,
        };
        const defaultPlayer = PlayerData.player;

        const wrapper = document.getElementById('wrapper');

        const client = Client.createClient(
                appConfig,
                appData,
                gameData,
                defaultPlayer,
                openFile,
                openExternal);

        const getClient = Redux.init(client, Reducers.reduce, Root, wrapper);
        Redux.render(client, Root, wrapper);

        EventHandler.addKeyHandlers();

        startTick(getClient);
}

export function newGame (client: Client.Client, player: Player.Player)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                folders: MessageData.folders,
        };
        const gameData = client.server.app.data;
        const newClient = Client.createClient(
                appConfig,
                appData,
                gameData,
                player,
                client.openFile,
                client.openExternal);

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
                folders: MessageData.folders,
        };
        const gameData = client.server.app.data;
        const openFile = client.openFile;
        const openExternal = client.openExternal;

        return Client.createClientFromSaveData(
                appConfig,
                appData,
                gameData,
                openFile,
                openExternal,
                saveData.saveData);
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
