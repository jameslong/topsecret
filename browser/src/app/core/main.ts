/// <reference path="../../../../typings/es6-polyfill/es6-polyfill.d.ts" />

import ConfigData = require('./data/config');
import MessageData = require('./data/messages');
import CommandData = require('./data/commands');
import PlayerData = require('./data/player');

import Client = require('./client');
import Clock = require('./clock');
import EventHandler = require('./eventhandler');
import KbpgpHelpers = require('../../../../core/src/app/kbpgp');
import Prom = require('../../../../core/src/app/utils/promise');
import Reducers = require('./action/reducers');
import Redux = require('./redux/redux');
import Root = require('./component/smart/root');
import Server = require('./server');
import State = require('../../../../core/src/app/state');

export function init (data: State.Data) {
        const wrapper = document.getElementById('wrapper');
        console.log('wrapper' + wrapper);

        const player = PlayerData.player;
        const config = ConfigData.createConfig();

        const server = Server.createServer(config, data);
        return Client.createClient(
                config,
                player,
                data,
                server,
                CommandData.commands,
                CommandData.commandIdsByMode,
                MessageData.folders)
        .then(client => {
                const server = client.server;

                const getClient = Redux.init(
                        client, Reducers.reduce, Root, wrapper);
                Redux.render(client, Root, wrapper);

                EventHandler.addKeyHandlers();

                return Server.beginGame(player, config, server).then(result =>
                        startTick(getClient, server)
                );
        });
}

function tick (getClient: () => Client.Client, server: Server.Server)
{
        Client.tickClient();
        const timestampMs = Clock.gameTimeMs(getClient().data.clock);
        return Server.tickServer(server, timestampMs);
}

export function startTick (getClient: () => Client.Client, server: Server.Server)
{
        const update = () => tick(getClient, server);
        const intervalMs = 1000;
        Prom.loop(intervalMs, update);
}
