/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-global.d.ts" />
///<reference path="../../typings/es6-polyfill/es6-polyfill.d.ts" />

import AsyncRequest = require('./asyncrequest');
import Config = require('./config');
import EventHandler = require('./eventhandler');
import Redux = require('./redux/redux');
import Root = require('./component/dumb/root');
import State = require('./state');
import StateReducers = require('./reducers/statereducers');

const wrapper = document.getElementById('wrapper');

const config: Config.Config = {
        serverURL: 'http://127.0.0.1:3000',
        autosaveDelayms: 3000,
        maxUndos: 50,
        gridSize: 11,
        vertexSize: { x: 66, y: 66 },
};

const data: State.Data = {
        narrativesById: {},
        edges: [],
        nameScratchpad: {},
};

const ui: State.UI = {
        activeNarrativeId: '',
        activeMessageId: '',
};

const store: State.Store ={ data, ui };

const state: State.State = {
        config: config,
        past: [],
        present: store,
        future: [],
        lastSaved: store,
        dirty: false,
};

const getStateFn = Redux.init(state, StateReducers.state, Root, wrapper);

AsyncRequest.requestNarratives(config.serverURL);
EventHandler.addKeyHandlers(getStateFn);
