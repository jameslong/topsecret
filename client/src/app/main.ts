/// <reference path="../../../core/src/app/global.d.ts"/>

import MessageData = require('./data/messages');
import CommandData = require('./data/commands');
import KeyData = require('./data/keys');
import PlayerData = require('./data/player');

import Map = require('./map/map');
import Redux = require('./redux/redux');
import State = require('./state');
import Root = require('./component/smart/root');
import EventHandler = require('./eventhandler');
import Reducers = require('./action/reducers');
import KbpgpHelpers = require('../../../core/src/app/kbpgp');

const wrapper = document.getElementById('wrapper');
KbpgpHelpers.loadFromKeyData(KeyData.keys).then(keyManagersById => {
        const state = State.createState(
                PlayerData.player,
                CommandData.commands,
                CommandData.commandIdsByMode,
                MessageData.folders,
                keyManagersById);

        Redux.init(state, Reducers.reduce, Root, wrapper);
        Redux.render(state, Root, wrapper);

        EventHandler.addKeyHandlers();
}).catch(err => {
        console.log(err);
        throw err;
});
