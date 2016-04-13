import Actions = require('./actions');
import AsyncRequest = require('../asyncrequest');
import Config = require('../config');
import Edge = require('../edge');
import Helpers = require('../helpers');
import Immutable = require('immutable');
import Message = require('../message');
import Narrative = require('../narrative');
import Redux = require('../redux/redux');
import State = require('../state');
import StoreReducers = require('./storereducers');

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
{
        const config = state.config;
        const narratives = action.parameters;
        const newNarratives = <Narrative.Narratives>narratives.map(Narrative.markNarrativeValid);
        const store = State.getActiveStore(state);
        const data = store.data;

        const names = Helpers.keys(narratives);
        const name = names.get(0);
        const narrative = newNarratives.get(name);

        const messages = narrative.messagesById;
        const newEdges = Edge.createEdges(messages, config.vertexSize);
        const newScratchpad = Immutable.Map<string, string>();
        const newData = State.Data({
                narrativesById: newNarratives,
                edges: newEdges,
                nameScratchpad: newScratchpad,
        });

        const newUI = State.UI({
                activeNarrativeId: name,
                activeMessageId: null,
        });

        const newStore = State.Store({
                ui: newUI,
                data: newData,
        });

        return State.State({
                config: state.config,
                past: Immutable.List.of<State.Store>(),
                present: newStore,
                future: Immutable.List.of<State.Store>(),
                lastSaved: newStore,
                dirty: false,
        });
}

function handleSave (state: State.State, action: Actions.Save)
{
        const activeStore = State.getActiveStore(state);

        const url = state.config.serverURL;
        const lastSaved = state.lastSaved;
        saveStoreDifference(url, lastSaved, activeStore);

        return state.set('dirty', false).set('lastSaved', activeStore);
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
        const different = Helpers.getUpdated(previousState, currentState);

        different.forEach((current, name) => {
                const previous = previousState.get(name);
                saveNarrativeDifference(url, previous, current);
        });
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

//                saveMapDifference(
//                        previous.profiles,
//                        current.profiles,
//                        Request.saveProfiles,
//                        Request.deleteProfiles);

        const saveMessage = (name: string, message: Message.Message) =>
                AsyncRequest.saveMessage(url, narrativeName, message);
        const deleteMessage = (name: string, message: Message.Message) =>
                AsyncRequest.deleteMessage(url, narrativeName, name);
        saveMapDifference(
                previous.messagesById,
                current.messagesById,
                saveMessage,
                deleteMessage);
}

function saveMapDifference<U, V> (
        previous: Immutable.Map<U, V>,
        current: Immutable.Map<U, V>,
        saveFn: (key: U, value: V) => void,
        deleteFn: (key: U, value: V) => void)
{
        if (previous !== current) {
                const updated = Helpers.getUpdated(previous, current);
                updated.forEach((value, key) => saveFn(key, value));

                const removed = Helpers.getRemoved(previous, current);
                removed.forEach((value, key) => deleteFn(key, value));
        }
}

function handleUndo (state: State.State, action: Actions.Undo)
{
        const past = state.past;
        if (past.size) {
                const present = state.present;
                const future = state.future;

                const newFuture = future.unshift(present);
                const newPresent = past.last();
                const newPast = past.pop();
                const newState = state.set('past', newPast)
                        .set('present', newPresent)
                        .set('future', newFuture);
                console.log(newState.toJS());
                return setDirtyState(newState);
        } else {
                console.log('No more undos');
                return state;
        }
}

function handleRedo (state: State.State, action: Actions.Redo)
{
        const future = state.future;
        if (future.size) {
                const present = state.present;
                const past = state.past;

                const newPast = past.push(present);
                const newPresent = future.first();
                const newFuture = future.shift();
                const newState = state.set('past', newPast)
                        .set('present', newPresent)
                        .set('future', newFuture);
                console.log(newState.toJS());
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
                return state.set('dirty', true);
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
        const past = state.past.push(state.present);
        const future = Immutable.List.of<State.Store>();
        const tempState = state.set('past', past)
                .set('present', present)
                .set('future', future);
        const newState = trimStores(tempState);
        return setDirtyState(newState);
}

function trimStores (state: State.State)
{
        const maxUndos = state.config.maxUndos;
        const maxRedos = maxUndos;
        const past = state.past;
        const future = state.future;

        if (past.size > maxUndos) {
                console.log('undo limit hit');
        }
        const newPast = (past.size <= maxUndos) ?
                past : past.slice(-maxUndos);

        if (future.size > maxRedos) {
                console.log('redo limit hit');
        }
        const newFuture = (future.size <= maxRedos) ?
                future : past.slice(0, maxUndos);

        return state.set('past', newPast).set('future', newFuture);
}
