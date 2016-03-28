/// <reference path="../../../core/src/app/global.d.ts"/>

import ConfigData = require('./data/config');
import MessageData = require('./data/messages');
import CommandData = require('./data/commands');
import PlayerData = require('./data/player');

import AsyncRequest = require('./asyncrequest');
import Client = require('./client');
import Clock = require('./clock');
import EventHandler = require('./eventhandler');
import KbpgpHelpers = require('../../../core/src/app/kbpgp');
import Prom = require('../../../core/src/app/utils/promise');
import Reducers = require('./action/reducers');
import Redux = require('./redux/redux');
import Root = require('./component/smart/root');
import Server = require('./server');

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

        Redux.init(client, Reducers.reduce, Root, wrapper);
        Redux.render(client, Root, wrapper);

        EventHandler.addKeyHandlers();

        return Server.beginGame(player, config, server).then(result =>
                startTick(client, server)
        );
}).catch(err => {
        console.log(err);
        throw err;
});

function tick (client: Client.Client, server: Server.Server)
{
        Client.tickClient(client);
        const timestampMs = Clock.gameTimeMs(client.data.clock);
        return Server.tickServer(server, timestampMs);
}

export function startTick (client: Client.Client, server: Server.Server)
{
        const update = () => tick(client, server);
        const intervalMs = 1000;
        Prom.loop(intervalMs, update);
}
