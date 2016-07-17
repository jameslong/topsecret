import Actions = require('../actions/actions');
import Arr = require('./../../../core/src/utils/array');
import AsyncRequest = require('../asyncrequest');
import Edge = require('../edge');
import Helpers = require('./../../../core/src/utils/helpers');
import Map = require('./../../../core/src/utils/map');
import EditorMessage = require('../editormessage');
import Narrative = require('../narrative');
import Redux = require('../redux/redux');
import ReplyOption = require('./../../../core/src/replyoption');
import State = require('../state');
import StoreReducers = require('./storereducers');

// Code to verify reducers don't mutate state
// export function state (state: State.State, action: Redux.Action<any>)
// {
//         const newState = stateInner(state, action);
//         deepFreeze(newState);
//         return newState;
// }
// function deepFreeze (o: any) {
//         Object.freeze(o);
//         Object.getOwnPropertyNames(o).forEach(prop => {
//                 if (o.hasOwnProperty(prop) &&
//                         o[prop] !== null &&
//                         (typeof o[prop] === "object" || typeof o[prop] === "function")
//                         && !Object.isFrozen(o[prop]))
//                 {
//                         deepFreeze(o[prop]);
//                 }
//         });
//
//         return o;
// };

export function state (state: State.State, action: Redux.Action<any>)
{
        switch (action.type) {
                case Actions.Types.SET_GAME_DATA:
                        const gameData = <Actions.SetGameData><any>action;
                        return handleSetGameData(state, gameData);

                case Actions.Types.SAVE:
                        const save = <Actions.Save><any>action;
                        return handleSave(state, save);

                case Actions.Types.UNDO:
                        const undo = <Actions.Undo><any>action;
                        return handleUndo(state, undo);

                case Actions.Types.REDO:
                        const redo = <Actions.Redo><any>action;
                        return handleRedo(state, redo);

                default:
                        const newPresent = StoreReducers.store(
                                state.present, state.config, action);
                        return (newPresent !== state.present) ?
                                onNewStore(state, newPresent) : state;
        }
}

function handleSetGameData (state: State.State, action: Actions.SetGameData)
        : State.State
{
        const config = state.config;
        const narratives = action.parameters;
        const newNarratives = Map.map(narratives, Narrative.markNarrativeValid);
        const store = State.getActiveStore(state);
        const data = store.data;

        const names = Object.keys(narratives);
        const name = names[0];
        const narrative = newNarratives[name];

        const messages = narrative.messagesById;
        const replyOptions = narrative.replyOptionsById;
        const newEdges = Edge.createEdges(
                messages, replyOptions, config.vertexSize);
        const newScratchpad: Map.Map<string> = {};
        const newData: State.Data = {
                narrativesById: newNarratives,
                edges: newEdges,
                nameScratchpad: newScratchpad,
        };

        const newUI: State.UI = {
                activeNarrativeId: name,
                activeMessageId: null,
        };

        const newStore: State.Store = {
                ui: newUI,
                data: newData,
        };

        return {
                config: state.config,
                past: [],
                present: newStore,
                future: [],
                lastSaved: newStore,
                dirty: false,
        };
}

function handleSave (state: State.State, action: Actions.Save)
{
        const activeStore = State.getActiveStore(state);
        const url = state.config.serverURL;
        saveStoreDifference(url, state.lastSaved, activeStore);

        const dirty = false;
        const lastSaved = activeStore;

        return Helpers.assign(state, { dirty, lastSaved });
}

function saveStoreDifference (
        url: string,
        previousStore: State.Store,
        currentStore: State.Store)
{
        saveNarrativesDifference(
                url,
                previousStore.data.narrativesById,
                currentStore.data.narrativesById);
}

function saveNarrativesDifference (
        url: string,
        previousState: Narrative.Narratives,
        currentState: Narrative.Narratives)
{
        const different = getUpdated(previousState, currentState);

        Map.forEach(different, (current, name) => {
                const previous = previousState[name];
                saveNarrativeDifference(url, previous, current);
        });
}

function getUpdated<U>(previous: Map.Map<U>, current: Map.Map<U>)
{
        return Map.filter(current, (value, key) => value !== previous[key]);
}

function saveNarrativeDifference (
        url: string,
        previous: Narrative.Narrative,
        current: Narrative.Narrative)
{
        const narrativeName = current.name;

        const saveString = (name: string, value: string) =>
                AsyncRequest.saveString(url, narrativeName, name, value);
        const deleteString = (name: string) =>
                AsyncRequest.deleteString(url, narrativeName, name);
        saveMapDifference(
                previous.stringsById,
                current.stringsById,
                saveString,
                deleteString);

        const saveReplyOption = (name: string, value: ReplyOption.ReplyOptions) =>
                AsyncRequest.saveReplyOption(url, narrativeName, name, value);
        const deleteReplyOption = (name: string) =>
                AsyncRequest.deleteReplyOption(url, narrativeName, name);
        saveMapDifference(
                previous.replyOptionsById,
                current.replyOptionsById,
                saveReplyOption,
                deleteReplyOption);

        const saveMessage = (name: string, message: EditorMessage.EditorMessage) =>
                AsyncRequest.saveMessage(url, narrativeName, message);
        const deleteMessage = (name: string, message: EditorMessage.EditorMessage) =>
                AsyncRequest.deleteMessage(url, narrativeName, name);
        saveMapDifference(
                previous.messagesById,
                current.messagesById,
                saveMessage,
                deleteMessage);
}

function saveMapDifference<U> (
        previous: Map.Map<U>,
        current: Map.Map<U>,
        saveFn: (key: string, value: U) => void,
        deleteFn: (key: string, value: U) => void)
{
        if (previous !== current) {
                const updated = getUpdated(previous, current);
                Map.forEach(updated, (value, key) => saveFn(key, value));

                const removed = getRemoved(previous, current);
                Map.forEach(removed, (value, key) => deleteFn(key, value));
        }
}

function getRemoved<U>(previous: Map.Map<U>, current: Map.Map<U>)
{
        return Map.filter(previous, (value, key) => !current[key]);
}

function handleUndo (state: State.State, action: Actions.Undo)
{
        const past = state.past;
        if (past.length) {
                const present = state.present;
                const future = state.future;

                const newFuture = [present, ...future];
                const newPresent = Arr.last(past);
                const newPast = past.slice(0, -1);
                const newState = Helpers.assign(state, {
                        past: newPast,
                        present: newPresent,
                        future: newFuture,
                });
                console.log(newState);
                return setDirtyState(newState);
        } else {
                console.log('No more undos');
                return state;
        }
}

function handleRedo (state: State.State, action: Actions.Redo)
{
        const future = state.future;
        if (future.length) {
                const present = state.present;
                const past = state.past;

                const newPast = [...past, present];
                const newPresent = future[0];
                const newFuture = future.slice(1);
                const newState = Helpers.assign(state, {
                        past: newPast,
                        present: newPresent,
                        future: newFuture,
                });
                console.log(newState);
                return setDirtyState(newState);
        } else {
                console.log('No more redos');
                return state;
        }
}

function setDirtyState (state: State.State)
{
        if (!state.dirty) {
                onDirtyState(state.config.autosaveDelayms);
                return Helpers.assign(state, { dirty: true });
        } else {
                return state;
        }
}

function onDirtyState (delayms: number)
{
        const callback = () => {
                const action: Actions.Save = {
                        type: Actions.Types.SAVE,
                        parameters: null,
                };

                Redux.handleAction(action);
        };
        setTimeout(callback, delayms);
}

function onNewStore (state: State.State, present: State.Store)
{
        console.log('new store');
        const past = [...state.past, state.present];
        const future: State.Store[] = [];
        const tempState = Helpers.assign(state, {
                past, present, future });
        const newState = trimStores(tempState);

        return (newState.present.data !== state.present.data) ?
                setDirtyState(newState) :
                newState;
}

function trimStores (state: State.State)
{
        const maxUndos = state.config.maxUndos;
        const maxRedos = maxUndos;
        const past = state.past;
        const future = state.future;

        if (past.length > maxUndos) {
                console.log('undo limit hit');
        }
        const newPast = (past.length <= maxUndos) ?
                past : past.slice(-maxUndos);

        if (future.length > maxRedos) {
                console.log('redo limit hit');
        }
        const newFuture = (future.length <= maxRedos) ?
                future : past.slice(0, maxUndos);

        return Helpers.assign(state, {
                past: newPast,
                future: newFuture,
        });
}
