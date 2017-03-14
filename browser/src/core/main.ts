/// <reference path="../../../typings/es6-polyfill/es6-polyfill.d.ts" />

import AppData = require('./data/appdata');
import ConfigData = require('./data/config');
import MessageData = require('./data/messages');
import CommandData = require('./data/commands');
import PlayerData = require('./data/player');

import Browser = require('./browser/browser');
import Client = require('./client');
import Clock = require('../../../core/src/clock');
import Data = require('./data');
import EventHandler = require('./eventhandler');
import KbpgpHelpers = require('../../../core/src/kbpgp');
import Helpers = require('../../../core/src/utils/helpers');
import LocalStorage = require('./localstorage');
import Prom = require('../../../core/src/utils/promise');
import Reducers = require('./reducers/reducers');
import Redux = require('./redux/redux');
import Server = require('./server');
import State = require('../../../core/src/gamestate');
import Player = require('./player');
import UI = require('./ui');

export function init (
        gameData: State.NarrativeStates,
        openFile: (path: string) => void,
        openExternal: (path: string) => void,
        quit: () => void)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                folders: MessageData.folders,
        };
        const defaultPlayer = PlayerData.player;

        const save = LocalStorage.getMostRecentSave<Client.SaveData>();
        const testing = appConfig.hasCustomSettings;
        const settings = appConfig.settings;
        const loadFromSave = (save && !testing);
        const client = (save && !testing) ?
                Client.createClientFromSaveData(
                        settings,
                        appData,
                        gameData,
                        openFile,
                        openExternal,
                        quit,
                        save.saveData) :
                Client.createClient(
                        settings,
                        appData,
                        gameData,
                        defaultPlayer,
                        openFile,
                        openExternal,
                        quit);

        const wrapper = document.getElementById('wrapper');
        const getClient = Redux.init(client, Reducers.reduce, Browser, wrapper);
        Redux.render(client, Browser, wrapper);

        EventHandler.addKeyHandlers();

        if (testing) {
                const player = client.data.player;
                const server = client.server;
                const clock = client.data.clock;
                Server.beginGame(player, settings, server, clock);
        }

        startTick(getClient);
}

export function newGame (
        gameData: State.NarrativeStates,
        player: Player.Player,
        openFile: (path: string) => void,
        openExternal: (path: string) => void,
        quit: () => void)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                folders: MessageData.folders,
        };
        const settings = appConfig.settings;
        const newClient = Client.createClient(
                settings,
                appData,
                gameData,
                player,
                openFile,
                openExternal,
                quit);

        const server = newClient.server;
        const clock = newClient.data.clock;
        Server.beginGame(player, settings, server, clock);

        return newClient;
}

export function newGameFromSave (
        gameData: State.NarrativeStates,
        openFile: (path: string) => void,
        openExternal: (path: string) => void,
        quit: () => void,
        saveData: Client.SaveData)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                folders: MessageData.folders,
        };

        return Client.createClientFromSaveData(
                appConfig.settings,
                appData,
                gameData,
                openFile,
                openExternal,
                quit,
                saveData.saveData);
}

function tick (getClient: () => Client.Client)
{
        const mode = getClient().ui.mode;
        const pausedModes = [
                UI.Modes.HOW_TO_PLAY,
                UI.Modes.LOAD_MENU,
                UI.Modes.MAIN_MENU,
                UI.Modes.SAVE_MENU,
                UI.Modes.NEW_GAME,
                UI.Modes.NEW_GAME_LOADING];
        const shouldTick = pausedModes.indexOf(mode) === -1;

        if (shouldTick) {
                Client.tickClient();
                const client = getClient();
                const server = client.server;
                const clock = client.data.clock;
                return Server.tickServer(server, clock);
        } else {
                Client.stallClient();
                return Promise.resolve(null);
        }
}

export function startTick (getClient: () => Client.Client)
{
        const update = () => tick(getClient);
        const intervalMs = 1000;
        Prom.loop(intervalMs, update);
}
