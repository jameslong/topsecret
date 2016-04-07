import Actions = require('./actions');
import AsyncRequest = require('../asyncrequest');
import Config = require('../config');
import Edge = require('../edge');
import Helpers = require('../helpers');
import Immutable = require('immutable');
import MathUtils = require('../math');
import Message = require('../message');
import Narrative = require('../narrative');
import Redux = require('../redux/redux');
import State = require('../state');

function setActiveNarrative (
        name: string, store: State.Store, config: Config.Config)
{
        const data = store.data;
        const narrative = data.narrativesById.get(name);
        const messages = narrative.messagesById;
        const newEdges = Edge.createEdges(messages, config.vertexSize);
        const newScratchpad = Immutable.Map<string, string>();
        const newData = State.Data({
                narrativesById: data.narrativesById,
                edges: newEdges,
        });

        const ui = store.ui;
        const newUI = State.UI({
                activeNarrativeId: name,
                activeMessageId: ui.activeMessageId,
                nameScratchpad: newScratchpad,
        });

        return State.Store({
                ui: newUI,
                data: newData,
        });
}

export function handleSetGameData (
        state: State.State, action: Actions.SetGameData)
{
        const narratives = action.parameters;
        const newNarratives = narratives.map(Narrative.markNarrativeValid);
        const store = State.getActiveStore(state);
        const data = store.data;
        const newData = data.set('narrativesById', newNarratives);
        const tempStore = store.set('data', newData);

        const names = Helpers.keys(narratives);
        const activeNarrative = names.get(0);
        const newStore = setActiveNarrative(
                activeNarrative, tempStore, state.config);

        const newStores = Immutable.List.of<State.Store>(newStore);
        return State.State({
                config: state.config,
                stores: newStores,
                activeStoreIndex: 0,
                lastSavedStore: newStore,
                dirty: false,
        });
}

interface ActionHandler<T> {
        (store: State.Store,
        config: Config.Config,
        action: T): State.Store,
}

export function wrapStoreUpdateFunc<T> (handler: ActionHandler<T>)
{
        return (state: State.State, action: T) =>
                wrapStoreUpdate(state, handler, action);
}

export function wrapStoreUpdate<T> (
        state: State.State,
        handler: ActionHandler<T>,
        action: T)
{
        const store = State.getActiveStore(state);
        const config = state.config;
        const newStore = handler(store, config, action);
        const lastStore = state.stores.last();

        return (newStore === lastStore) ?
                state : addNewStore(state, newStore);
}

export function addNewStore (state: State.State, store: State.Store)
{
        console.log('new store');
        const newActiveIndex = state.activeStoreIndex + 1;
        const stores = state.stores;
        const size = stores.size;
        const numRemoved = size - newActiveIndex;
        const newStores = stores.splice(
                newActiveIndex, numRemoved, store);
        const tempState = state.set('stores', newStores)
                .set('activeStoreIndex', newActiveIndex);
        const newState = trimStores(tempState);
        return setDirtyState(newState);
}

export function trimStores (state: State.State)
{
        const maxUndos = state.config.maxUndos;
        const stores = state.stores;
        if (stores.size <= maxUndos) {
                return state;
        } else {
                console.log('undo/redo limit hit');
                const newStores = stores.slice(-maxUndos);
                const newState =  state.set('stores', newStores);

                const lastIndex = Math.max(0, maxUndos - 1);
                return (state.activeStoreIndex > lastIndex) ?
                        newState.set('activeStoreIndex', lastIndex) :
                        newState;
        }
}

export function onDirtyState (delayms: number)
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

export function setDirtyState (state: State.State)
{
        if (!state.dirty) {
                onDirtyState(state.config.autosaveDelayms);
                return state.set('dirty', true);
        } else {
                return state;
        }
}

export function handleUndo (state: State.State, action: Actions.Undo)
{
        const newIndex = Math.max(0, state.activeStoreIndex - 1);
        const newState = state.set('activeStoreIndex', newIndex);
        return setDirtyState(newState);
}

export function handleRedo (state: State.State, action: Actions.Redo)
{
        const lastIndex = Math.max(0, state.stores.size - 1);
        const currentIndex = state.activeStoreIndex;
        const newIndex = Math.min(lastIndex, currentIndex + 1);
        const newState = state.set('activeStoreIndex', newIndex);
        return setDirtyState(newState);
}

export function getMessageGroup (name: string, store: State.Store)
{
        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const message = messages.get(name);
        const selected = message.selected;

        return selected ?
                Message.getSelectedMessages(messages) :
                Immutable.Map<string, Message.Message>(
                        [[message.name, message]]);
}

export function handleEndDrag (
        store: State.Store, config: Config.Config, action: Actions.EndDrag)
{
        const parameters = action.parameters;
        const name = parameters.id;
        const delta = parameters.delta;
        const gridSize = config.gridSize;
        const selectedMessages = getMessageGroup(name, store);

        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;

        const updatedMessages = <Message.Messages>selectedMessages.map(
                message => updatePosition(delta, gridSize, message));
        const newMessages = messages.merge(updatedMessages);

        const newNarrative = narrative.set('messagesById', newMessages);
        const newNarratives = store.data.narrativesById.set(
                narrative.name, newNarrative);

        const newEdges = Edge.createEdges(
                newMessages, config.vertexSize);

        const newData = State.Data({
                narrativesById: newNarratives,
                edges: newEdges,
        });

        return store.set('data', newData);
}

function roundToNearestMultiple (multiple: number, value: number)
{
        const diff = value % multiple;
        return (diff <= multiple / 2) ?
                value - diff :
                value + multiple - diff;
}

function updatePosition (
        delta: MathUtils.Coord,
        gridSize: number,
        message: Message.Message)
{
        const position = message.position;
        const newX = position.x + delta.x;
        const newY = position.y + delta.y;
        const roundedX = roundToNearestMultiple(gridSize, newX);
        const roundedY = roundToNearestMultiple(gridSize, newY);

        const newPosition = MathUtils.Coord({
                x: roundedX,
                y: roundedY,
        });

        return message.set('position', newPosition);
}

export function handleSetActiveNarrative (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetActiveNarrative)
{
        const name = action.parameters;
        return setActiveNarrative(name, store, config);
}

export function handleOpenMessage (
        store: State.Store,
        config: Config.Config,
        action: Actions.OpenMessage)
{
        const name = action.parameters;
        const newUI = store.ui.set('activeMessageId', name);
        return store.set('ui', newUI);
}

export function handleCloseMessage (
        store: State.Store,
        config: Config.Config,
        action: Actions.CloseMessage)
{
        const newUI = store.ui.set('activeMessageId', null);
        const newStore = store.set('ui', newUI);
        return onNarrativeUpdate(newStore, config);
}

export function handleSave (state: State.State, action: Actions.Save)
{
        const activeStore = State.getActiveStore(state);

        const url = state.config.serverURL;
        const lastSavedStore = state.lastSavedStore;
        saveStoreDifference(url, lastSavedStore, activeStore);

        return state.set('dirty', false)
                .set('lastSavedStore', activeStore);
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

function getCentrePosition ()
{
        const scrollX = window.scrollX;
        const scrollY = window.scrollY
        const width = window.innerWidth;
        const height = window.innerHeight;
        const centreX = Math.round(scrollX + (width / 2));
        const centreY = Math.round(scrollY + (height / 2));

        return MathUtils.Coord({
                x: centreX,
                y: centreY,
        });
}

function onNarrativeUpdate (
        store: State.Store, config: Config.Config)
{
        const data = store.data;
        const narratives = data.narrativesById;
        const activeNarrative = store.ui.activeNarrativeId;
        const narrative = narratives.get(activeNarrative);
        const messages = narrative.messagesById;
        const newMessages = Message.markMessagesValid(
                messages, narrative.stringsById, narrative.profilesById);
        const newNarrative = narrative.set('messagesById', newMessages);
        const newNarratives = narratives.set(
                activeNarrative, newNarrative);

        const newEdges = Edge.createEdges(
                newMessages, config.vertexSize);
        const newData = store.data.set('edges', newEdges)
                .set('narrativesById', newNarratives);
        return store.set('data', newData);
}

export function handleCreateMessage (
        store: State.Store,
        config: Config.Config,
        action: Actions.CreateMessage)
{
        const data = store.data;
        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const name = Message.createUniqueMessageName(messages);
        const newPosition = getCentrePosition();
        const tempMessage = Message.Message().
                set('position', newPosition);
        const newMessage = tempMessage.set('name', name);
        const newMessages = messages.set(name, newMessage);
        const newNarrative = narrative.set('messagesById', newMessages);
        const newNarratives = data.narrativesById.set(
                narrative.name, newNarrative);
        const newData = data.set('narrativesById', newNarratives);

        return store.set('data', newData);
}

export function handleDeleteMessage (
        store: State.Store,
        config: Config.Config,
        action: Actions.DeleteMessage)
{
        const name = action.parameters;
        const narrative = Narrative.getActiveNarrative(store);

        const data = store.data;
        const newMessages = narrative.messagesById.delete(name);
        const newNarrative = narrative.set('messagesById', newMessages);
        const newNarratives = data.narrativesById.set(
                narrative.name, newNarrative);
        const newData = data.set('narrativesById', newNarratives);
        let newUI = store.ui;

        newUI = (newUI.activeMessageId === name) ?
                newUI.set('activeMessageId', '') : newUI;

        const newStore = store.set('data', newData).set('ui', newUI);

        return onNarrativeUpdate(newStore, config);
}

export function handleDeselectMessage (
        store: State.Store,
        config: Config.Config,
        action: Actions.DeselectMessage)
{
        const name = action.parameters;
        const narrative = Narrative.getActiveNarrative(store);
        const message = narrative.messagesById.get(name);
        const selected = Immutable.Map<string, Message.Message>(
                [[name, message]]);
        return deselectMessages(selected, store);
}

export function handleDeselectAllMessages (
        store: State.Store,
        config: Config.Config,
        action: Actions.DeselectAllMessages)
{
        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const selected = Message.getSelectedMessages(messages);
        return deselectMessages(selected, store);
}

export function deselectMessages (
        selected: Message.Messages, store: State.Store)
{
        const narrative = Narrative.getActiveNarrative(store);

        const updatedMessages = selected.map(message =>
                message.set('selected', false));
        const newMessages = narrative.messagesById.merge(updatedMessages);
        const newNarrative = narrative.set('messagesById', newMessages);
        const data = store.data;
        const newNarratives = data.narrativesById.set(
                narrative.name, newNarrative);

        const ui = store.ui;
        const scratchpad = ui.nameScratchpad;
        const newScratchpad = scratchpad.filter((newName, name) =>
                !selected.has(name));

        const newData = data.set('narrativesById', newNarratives);
        const newUI = ui.set('nameScratchpad', newScratchpad);

        return store.set('data', newData).set('ui', newUI);
}

export function handleSelectMessage (
        store: State.Store,
        config: Config.Config,
        action: Actions.SelectMessage)
{
        const name = action.parameters;
        return selectMessage(name, store);
}

export function handleUniqueSelectMessage (
        store: State.Store,
        config: Config.Config,
        action: Actions.UniqueSelectMessage)
{
        const name = action.parameters;

        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const selected = Message.getSelectedMessages(messages);
        const newStore = deselectMessages(selected, store);

        return selectMessage(name, newStore);
}

function selectMessage(name: string, store: State.Store)
{
        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const message = messages.get(name);
        const newMessage = message.set('selected', true);
        const newMessages = messages.set(name, newMessage);
        const newNarrative = narrative.set('messagesById', newMessages);
        const data = store.data;
        const newNarratives = data.narrativesById.set(
                narrative.name, newNarrative);

        const newData = data.set('narrativesById', newNarratives);
        return store.set('data', newData);
}

export function handleSetEditedMessageName (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetEditedMessageName)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const newName = parameters.value;

        const ui = store.ui;
        const scratchpad = ui.nameScratchpad;
        const newScratchpad = scratchpad.set(name, newName);
        const newUI = ui.set('nameScratchpad', newScratchpad);

        return store.set('ui', newUI);
}

export function handleSetMessageName (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageName)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const ui = store.ui;
        const newName = ui.nameScratchpad.get(name);

        const data = store.data;
        const narratives = data.narrativesById;
        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const message = messages.get(name);
        const newMessage = message.set('name', newName);
        const tempMessages = messages.set(newName, newMessage);
        const newMessages = tempMessages.delete(name);
        const newNarrative = narrative.set('messagesById', newMessages);
        const newNarratives = narratives.set(narrative.name, newNarrative);
        const newData = data.set('narrativesById', newNarratives)

        const scratchpad = ui.nameScratchpad;
        const newScratchpad = scratchpad.delete(name);
        const newUI = ui.set('nameScratchpad', newScratchpad)
                .set('activeMessageId', newName);

        return store.set('data', newData).set('ui', newUI);
}

function setMessageProperty (
        name: string,
        propertyName: string,
        propertyValue: any,
        store: State.Store)
{
        const data = store.data;
        const narratives = data.narrativesById;
        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const message = messages.get(name);
        const newMessage = message.set(propertyName, propertyValue);
        const newMessages = messages.set(name, newMessage);
        const newNarrative = narrative.set('messagesById', newMessages);
        const newNarratives = narratives.set(
                narrative.name, newNarrative);
        const newData = data.set('narrativesById', newNarratives);

        return store.set('data', newData);
}

export function handleSetMessageSubject (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageSubject)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'threadSubject',
                parameters.value,
                store);
}

export function handleSetMessageEndGame (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageEndGame)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'endGame',
                parameters.value,
                store);
}

export function handleSetMessageEncrypted (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageEncrypted)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'encrypted',
                parameters.value,
                store);
}

export function handleSetMessageScript (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageScript)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'script',
                parameters.value,
                store);
}

export function handleSetMessagePosition (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessagePosition)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'position',
                parameters.value,
                store);
}

export function handleSetMessageContent (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageContent)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'message',
                parameters.value,
                store);
}

export function handleSetMessageFallback (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageFallback)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'fallback',
                parameters.value,
                store);
}

export function handleSetMessageChildren (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageChildren)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'children',
                parameters.value,
                store);
}

export function handleSetMessageReplyOptions (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetMessageReplyOptions)
{
        const parameters = action.parameters;
        const name = parameters.name;
        return setMessageProperty(
                name,
                'replyOptions',
                parameters.value,
                store);
}

export function handleSetString (
        store: State.Store,
        config: Config.Config,
        action: Actions.SetString)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const value = parameters.value;

        const narrative = Narrative.getActiveNarrative(store);
        const strings = narrative.stringsById;
        const newStrings = strings.set(name, value);

        const data = store.data;
        const newNarrative = narrative.set('stringsById', newStrings);
        const newNarratives = data.narrativesById.set(
                narrative.name, newNarrative);
        const newData = data.set('narrativesById', newNarratives);

        return store.set('data', newData);
}
