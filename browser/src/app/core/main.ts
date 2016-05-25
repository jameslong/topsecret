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

export function init (gameData: State.Data)
{
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                menuItems: MenuData.items,
                folders: MessageData.folders,
        };
        return appInit(appConfig, appData, gameData);
}
export function appInit (
        appConfig: ConfigData.ConfigData,
        appData: AppData.AppData,
        gameData: State.Data)
{
        const wrapper = document.getElementById('wrapper');
        console.log('wrapper' + wrapper);

        const player = PlayerData.player;
        const clock = Clock.createClock(appConfig.timeFactor);

        const profiles = gameData[appConfig.version].profiles;
        const server = Server.createServer(appConfig, gameData, clock);
        const client = Client.createClient(
                appConfig, appData, profiles, player, server, clock);

        const getClient = Redux.init(client, Reducers.reduce, Root, wrapper);
        Redux.render(client, Root, wrapper);

        EventHandler.addKeyHandlers();

        return Server.beginGame(player, appConfig, server).then(result =>
                startTick(getClient)
        );
}

export function newGame (client: Client.Client)
{
        const gameData = client.server.app.data;
        const appConfig = ConfigData.createConfig();
        const appData = {
                commands: CommandData.commands,
                commandIdsByMode: CommandData.commandIdsByMode,
                menuItems: MenuData.items,
                folders: MessageData.folders,
        };
        const clock = Clock.createClock(appConfig.timeFactor);
        const server = Server.createServer(appConfig, gameData, clock);
        const messageId = 0;
        const player = client.data.player;
        const playerData = PlayerData.player;
        const profiles = gameData[appConfig.version].profiles;
        const data = Data.createData(appData, profiles, player, clock);
        Server.beginGame(playerData, appConfig, server);

        return Helpers.assign(client, { server, data, messageId });

}

function tick (getClient: () => Client.Client)
{
        Client.tickClient();

        const client = getClient();
        const server = client.server;
        server.app.clock = client.data.clock;
        return Server.tickServer(server);
}

export function startTick (getClient: () => Client.Client)
{
        const update = () => tick(getClient);
        const intervalMs = 1000;
        Prom.loop(intervalMs, update);
}
