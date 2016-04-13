/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../../typings/react/react-global.d.ts" />
///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
///<reference path='../../../typings/immutable/immutable-overrides.d.ts'/>
///<reference path="../../../typings/es6-polyfill/es6-polyfill.d.ts" />

import AsyncRequest = require('./asyncrequest');
import Config = require('./config');
import Edge = require('./edge');
import EventHandler = require('./eventhandler');
import Immutable = require('immutable');
import MathUtils = require('./math');
import Narrative = require('./narrative');
import Redux = require('./redux/redux');
import Root = require('./component/dumb/root');
import State = require('./state');
import StateReducers = require('./action/statereducers');

const wrapper = document.getElementById('wrapper');

const config = Config.Config({
        serverURL: 'http://127.0.0.1:3000',
        autosaveDelayms: 3000,
        maxUndos: 30,
        gridSize: 11,
        vertexSize: MathUtils.Coord({ x: 66, y: 66 }),
});

const data = State.Data({
        narrativesById: Immutable.Map<string, Narrative.Narrative>(),
        edges: Immutable.List<Edge.Edge>(),
        nameScratchpad: Immutable.Map<string, string>(),
});

const ui = State.UI({
        activeNarrativeId: '',
        activeMessageId: '',
});

const store = State.Store({ data, ui });

const state = State.State({
        config: config,
        past: Immutable.List.of<State.Store>(),
        present: store,
        future: Immutable.List.of<State.Store>(),
        lastSaved: store,
        dirty: false,
});

Redux.init(state, StateReducers.state, Root.Root, wrapper);

AsyncRequest.requestNarratives(config.serverURL);
EventHandler.addKeyHandlers();
