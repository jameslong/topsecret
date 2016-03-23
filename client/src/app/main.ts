/// <reference path="../../../core/src/app/global.d.ts"/>

import MessageData = require('./data/messages');
import CommandData = require('./data/commands');
import KeyData = require('./data/keys');
import PlayerData = require('./data/player');

import EventHandler = require('./eventhandler');
import KbpgpHelpers = require('../../../core/src/app/kbpgp');
import Reducers = require('./action/reducers');
import Redux = require('./redux/redux');
import Root = require('./component/smart/root');
import Server = require('./server');
import State = require('./state');

const wrapper = document.getElementById('wrapper');

KbpgpHelpers.loadFromKeyData(KeyData.keys).then(keyManagersById => {
        const state = State.createState(
                PlayerData.player,
                CommandData.commands,
                CommandData.commandIdsByMode,
                MessageData.folders,
                keyManagersById)
        const getState = Redux.init(state, Reducers.reduce, Root, wrapper);

        Redux.render(state, Root, wrapper);

        EventHandler.addKeyHandlers();
        Server.init(getState);
}).catch(err => {
        console.log(err);
        throw err;
});
