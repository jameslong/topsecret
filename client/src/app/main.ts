/// <reference path="../../../typings/es6-polyfill/es6-polyfill.d.ts" />

import ConfigData = require('./core/data/config');
import MessageData = require('./core/data/messages');
import CommandData = require('./core/data/commands');
import PlayerData = require('./core/data/player');

import AsyncRequest = require('./core/asyncrequest');
import Client = require('./core/client');
import Clock = require('./core/clock');
import EventHandler = require('./core/eventhandler');
import KbpgpHelpers = require('../../../core/src/app/kbpgp');
import Prom = require('../../../core/src/app/utils/promise');
import Reducers = require('./core/action/reducers');
import Redux = require('./core/redux/redux');
import Root = require('./core/component/smart/root');
import Server = require('./core/server');

const wrapper = document.getElementById('wrapper');

const player = PlayerData.player;
const config = ConfigData.createConfig();

AsyncRequest.narratives(config.serverURL).then(data => {
        const server = Server.createServer(config, data);
        return Client.createClient(
                config,
                player,
                data,
                server,
                CommandData.commands,
                CommandData.commandIdsByMode,
                MessageData.folders);
}).then(client => {
        const server = client.server;

        const getClient = Redux.init(client, Reducers.reduce, Root, wrapper);
        Redux.render(client, Root, wrapper);

        EventHandler.addKeyHandlers();

        return Server.beginGame(player, config, server).then(result =>
                startTick(getClient, server)
        );
}).catch(err => {
        console.log(err);
        throw err;
});

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
