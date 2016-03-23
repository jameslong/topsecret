/// <reference path="../../../core/src/app/global.d.ts"/>

import MessageData = require('./data/messages');
import CommandData = require('./data/commands');
import KeyData = require('./data/keys');
import PlayerData = require('./data/player');

import EventHandler = require('./eventhandler');
import KbpgpHelpers = require('../../../core/src/app/kbpgp');
import Prom = require('../../../core/src/app/utils/promise');
import Reducers = require('./action/reducers');
import Redux = require('./redux/redux');
import Root = require('./component/smart/root');
import Server = require('./server');
import State = require('./state');

const wrapper = document.getElementById('wrapper');

Promise.all([
        createClient(),
        Server.createServer(),
]).then(result => {
        const client = result[0];
        const server = result[1];

        Redux.init(client, Reducers.reduce, Root, wrapper);
        Redux.render(client, Root, wrapper);

        EventHandler.addKeyHandlers();

        return Server.beginGame(server).then(result =>
                startTick(client, server)
        );
}).catch(err => {
        console.log(err);
        throw err;
});

function createClient ()
{
        return KbpgpHelpers.loadFromKeyData(KeyData.keys).then(keyManagersById =>
                State.createState(
                        PlayerData.player,
                        CommandData.commands,
                        CommandData.commandIdsByMode,
                        MessageData.folders,
                        keyManagersById)
        );
}

function tick (client: State.State, server: Server.Server)
{
        const timestampMs = Date.now();

        State.tickClient(client, timestampMs);
        return Server.tickServer(server, timestampMs);
}

export function startTick (client: State.State, server: Server.Server)
{
        const update = () => tick(client, server);
        const intervalMs = 1000;
        Prom.loop(intervalMs, update);
}
