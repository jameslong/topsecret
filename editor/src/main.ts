/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-global.d.ts" />
///<reference path="../../typings/es6-polyfill/es6-polyfill.d.ts" />

import Actions = require('./actions/actions');
import AsyncRequest = require('./asyncrequest');
import Editor = require('./editor/editor');
import EditorMessage = require('./editormessage');
import Redux = require('./redux/redux');
import State = require('./state');
import StateReducers = require('./reducers/statereducers');

const wrapper = document.getElementById('wrapper');

const config: State.Config = {
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

const store: State.Store = { data, ui };

const state: State.State = {
        config: config,
        past: [],
        present: store,
        future: [],
        lastSaved: store,
        dirty: false,
};

const getStateFn = Redux.init(state, StateReducers.state, Editor, wrapper);

AsyncRequest.requestNarratives(config.serverURL);
window.onkeydown = (e: KeyboardEvent) => onKeyDown(e, getStateFn());

function onKeyDown (e: KeyboardEvent, state: State.State)
{
        e.stopPropagation();

        if (e.ctrlKey) {
                switch (e.keyCode) {
                case 90:
                        return onUndo();
                case 89:
                        return onRedo();
                default:
                        return;
                }
        } else if (e.keyCode === 46) {
                return onDelete(state);
        }
}

function onUndo ()
{
        const action = Actions.undo();
        Redux.handleAction(action);
}

function onRedo ()
{
        const action = Actions.redo();
        Redux.handleAction(action);
}

function onDelete (state: State.State)
{
        const present = state.present;
        const narrativeId = present.ui.activeNarrativeId;
        const messages = present.data.narrativesById[narrativeId].messagesById;
        const namesMap = EditorMessage.getSelectedMessages(messages);
        const names = Object.keys(namesMap);
        const params = { names, narrativeId };
        const action = Actions.deleteMessages(params);
        Redux.handleAction(action);
}
