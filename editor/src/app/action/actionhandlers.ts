///<reference path='../edge.ts'/>

module ActionHandlers {
        function setActiveNarrative (
                name: string, store: Im.Store, config: Im.Config)
        {
                const narrative = store.narratives.get(name);
                const messages = narrative.messages;

                const newEdges = Im.createEdges(
                        messages, config.vertexSize);
                const newScratchpad = Immutable.Map<string, string>();

                return Im.Store({
                        activeNarrative: name,
                        activeMessage: store.activeMessage,
                        narratives: store.narratives,
                        edges: newEdges,
                        nameScratchpad: newScratchpad,
                });
        }

        export function handleSetGameData (
                state: Im.State, action: Actions.SetGameData)
        {
                const narratives = action.parameters;
                const newNarratives = narratives.map(Im.markNarrativeValid);
                const store = Im.getActiveStore(state);
                const tempStore = store.set('narratives', newNarratives);

                const names = Im.keys(narratives);
                const activeNarrative = names.get(0);
                const newStore = setActiveNarrative(
                        activeNarrative, tempStore, state.config);

                const newStores = Immutable.List.of<Im.Store>(newStore);
                return Im.State({
                        config: state.config,
                        stores: newStores,
                        activeStoreIndex: 0,
                        lastSavedStore: newStore,
                        dirty: false,
                });
        }

        interface ActionHandler<T> {
                (store: Im.Store,
                config: Im.Config,
                action: T): Im.Store,
        }

        export function wrapStoreUpdateFunc<T> (handler: ActionHandler<T>)
        {
                return (state: Im.State, action: T) =>
                        wrapStoreUpdate(state, handler, action);
        }

        export function wrapStoreUpdate<T> (
                state: Im.State,
                handler: ActionHandler<T>,
                action: T)
        {
                const store = Im.getActiveStore(state);
                const config = state.config;
                const newStore = handler(store, config, action);
                const lastStore = state.stores.last();

                return (newStore === lastStore) ?
                        state : addNewStore(state, newStore);
        }

        export function addNewStore (state: Im.State, store: Im.Store)
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

        export function trimStores (state: Im.State)
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

                        Flux.handleAction(action);
                };
                setTimeout(callback, delayms);
        }

        export function setDirtyState (state: Im.State)
        {
                if (!state.dirty) {
                        onDirtyState(state.config.autosaveDelayms);
                        return state.set('dirty', true);
                } else {
                        return state;
                }
        }

        export function handleUndo (state: Im.State, action: Actions.Undo)
        {
                const newIndex = Math.max(0, state.activeStoreIndex - 1);
                const newState = state.set('activeStoreIndex', newIndex);
                return setDirtyState(newState);
        }

        export function handleRedo (state: Im.State, action: Actions.Redo)
        {
                const lastIndex = Math.max(0, state.stores.size - 1);
                const currentIndex = state.activeStoreIndex;
                const newIndex = Math.min(lastIndex, currentIndex + 1);
                const newState = state.set('activeStoreIndex', newIndex);
                return setDirtyState(newState);
        }

        export function getMessageGroup (name: string, store: Im.Store)
        {
                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const message = messages.get(name);
                const selected = message.selected;

                return selected ?
                        Im.getSelectedMessages(messages) :
                        Immutable.Map<string, Im.Message>(
                                [[message.name, message]]);
        }

        export function handleEndDrag (
                store: Im.Store, config: Im.Config, action: Actions.EndDrag)
        {
                const parameters = action.parameters;
                const name = parameters.id;
                const delta = parameters.delta;
                const gridSize = config.gridSize;
                const selectedMessages = getMessageGroup(name, store);

                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;

                const updatedMessages = <Im.Messages>selectedMessages.map(
                        message => updatePosition(delta, gridSize, message));
                const newMessages = messages.merge(updatedMessages);

                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                const newEdges = Im.createEdges(
                        newMessages, config.vertexSize);

                return Im.Store({
                        activeNarrative: store.activeNarrative,
                        activeMessage: store.activeMessage,
                        narratives: newNarratives,
                        edges: newEdges,
                        nameScratchpad: store.nameScratchpad,
                });
        }

        function roundToNearestMultiple (multiple: number, value: number)
        {
                const diff = value % multiple;
                return (diff <= multiple / 2) ?
                        value - diff :
                        value + multiple - diff;
        }

        function updatePosition (
                delta: Im.Coord,
                gridSize: number,
                message: Im.Message)
        {
                const position = message.position;
                const newX = position.x + delta.x;
                const newY = position.y + delta.y;
                const roundedX = roundToNearestMultiple(gridSize, newX);
                const roundedY = roundToNearestMultiple(gridSize, newY);

                const newPosition = Im.Coord({
                        x: roundedX,
                        y: roundedY,
                });

                return message.set('position', newPosition);
        }

        export function handleSetActiveNarrative (
                store: Im.Store,
                config: Im.Config,
                action: Actions.SetActiveNarrative)
        {
                const name = action.parameters;
                return setActiveNarrative(name, store, config);
        }

        export function handleOpenMessage (
                store: Im.Store,
                config: Im.Config,
                action: Actions.OpenMessage)
        {
                const name = action.parameters;
                window.document.body.classList.add('open-modal');

                return store.set('activeMessage', name);
        }

        export function handleCloseMessage (
                store: Im.Store,
                config: Im.Config,
                action: Actions.CloseMessage)
        {
                window.document.body.classList.remove('open-modal');
                const newStore = store.set('activeMessage', null);
                return onNarrativeUpdate(newStore, config);
        }

        export function handleSave (state: Im.State, action: Actions.Save)
        {
                const activeStore = Im.getActiveStore(state);

                const url = state.config.serverURL;
                const lastSavedStore = state.lastSavedStore;
                saveStoreDifference(url, lastSavedStore, activeStore);

                return state.set('dirty', false)
                        .set('lastSavedStore', activeStore);
        }

        function saveStoreDifference (
                url: string,
                previousStore: Im.Store,
                currentStore: Im.Store)
        {
                saveNarrativesDifference(
                        url,
                        previousStore.narratives,
                        currentStore.narratives);
        }

        function saveNarrativesDifference (
                url: string,
                previousState: Im.Narratives,
                currentState: Im.Narratives)
        {
                const different = Im.getUpdated(previousState, currentState);

                different.forEach((current, name) => {
                        const previous = previousState.get(name);
                        saveNarrativeDifference(url, previous, current);
                });
        }

        function saveNarrativeDifference (
                url: string,
                previous: Im.Narrative,
                current: Im.Narrative)
        {
                const narrativeName = current.name;

                const saveString = (name: string, value: string) =>
                        AsyncRequest.saveString(url, narrativeName, name, value);
                const deleteString = (name: string) =>
                        AsyncRequest.deleteString(url, narrativeName, name);
                saveMapDifference(
                        previous.strings,
                        current.strings,
                        saveString,
                        deleteString);

//                saveMapDifference(
//                        previous.profiles,
//                        current.profiles,
//                        Request.saveProfiles,
//                        Request.deleteProfiles);

                const saveMessage = (name: string, message: Im.Message) =>
                        AsyncRequest.saveMessage(url, narrativeName, message);
                const deleteMessage = (name: string, message: Im.Message) =>
                        AsyncRequest.deleteMessage(url, narrativeName, name);
                saveMapDifference(
                        previous.messages,
                        current.messages,
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
                        const updated = Im.getUpdated(previous, current);
                        updated.forEach((value, key) => saveFn(key, value));

                        const removed = Im.getRemoved(previous, current);
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

                return Im.Coord({
                        x: centreX,
                        y: centreY,
                });
        }

        function onNarrativeUpdate (
                store: Im.Store, config: Im.Config)
        {
                const narratives = store.narratives;
                const activeNarrative = store.activeNarrative;
                const narrative = narratives.get(activeNarrative);
                const messages = narrative.messages;
                const newMessages = Im.markMessagesValid(
                        messages, narrative.strings, narrative.profiles);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = narratives.set(
                        activeNarrative, newNarrative);

                const newEdges = Im.createEdges(
                        newMessages, config.vertexSize);
                return store.set('edges', newEdges)
                        .set('narratives', newNarratives);
        }

        export function handleCreateMessage (
                store: Im.Store,
                config: Im.Config,
                action: Actions.CreateMessage)
        {
                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const name = Im.createUniqueMessageName(messages);
                const newPosition = getCentrePosition();
                const tempMessage = Im.Message().
                        set('position', newPosition);
                const newMessage = tempMessage.set('name', name);
                const newMessages = messages.set(name, newMessage);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                return store.set('narratives', newNarratives);
        }

        export function handleDeleteMessage (
                store: Im.Store,
                config: Im.Config,
                action: Actions.DeleteMessage)
        {
                const name = action.parameters;
                const narrative = Im.getActiveNarrative(store);

                const newMessages = narrative.messages.delete(name);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);
                let newStore = store.set('narratives', newNarratives);

                newStore = (newStore.activeMessage === name) ?
                        newStore.set('activeMessage', '') : newStore;

                return onNarrativeUpdate(newStore, config);
        }

        export function handleDeselectMessage (
                store: Im.Store,
                config: Im.Config,
                action: Actions.DeselectMessage)
        {
                const name = action.parameters;
                const narrative = Im.getActiveNarrative(store);
                const message = narrative.messages.get(name);
                const selected = Immutable.Map<string, Im.Message>(
                        [[name, message]]);
                return deselectMessages(selected, store);
        }

        export function handleDeselectAllMessages (
                store: Im.Store,
                config: Im.Config,
                action: Actions.DeselectAllMessages)
        {
                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const selected = Im.getSelectedMessages(messages);
                return deselectMessages(selected, store);
        }

        export function deselectMessages (
                selected: Im.Messages, store: Im.Store)
        {
                const narrative = Im.getActiveNarrative(store);

                const updatedMessages = selected.map(message =>
                        message.set('selected', false));
                const newMessages = narrative.messages.merge(updatedMessages);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                const scratchpad = store.nameScratchpad;
                const newScratchpad = scratchpad.filter((newName, name) =>
                        !selected.has(name));

                return store.set('narratives', newNarratives)
                        .set('nameScratchpad', newScratchpad);
        }

        export function handleSelectMessage (
                store: Im.Store,
                config: Im.Config,
                action: Actions.SelectMessage)
        {
                const name = action.parameters;
                return selectMessage(name, store);
        }

        export function handleUniqueSelectMessage (
                store: Im.Store,
                config: Im.Config,
                action: Actions.UniqueSelectMessage)
        {
                const name = action.parameters;

                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const selected = Im.getSelectedMessages(messages);
                const newStore = deselectMessages(selected, store);

                return selectMessage(name, newStore);
        }

        function selectMessage(name: string, store: Im.Store)
        {
                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const message = messages.get(name);
                const newMessage = message.set('selected', true);
                const newMessages = messages.set(name, newMessage);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                return store.set('narratives', newNarratives);
        }

        export function handleSetEditedMessageName (
                store: Im.Store,
                config: Im.Config,
                action: Actions.SetEditedMessageName)
        {
                const parameters = action.parameters;
                const name = parameters.name;
                const newName = parameters.value;

                const scratchpad = store.nameScratchpad;
                const newScratchpad = scratchpad.set(name, newName);

                return store.set('nameScratchpad', newScratchpad);
        }

        export function handleSetMessageName (
                store: Im.Store,
                config: Im.Config,
                action: Actions.SetMessageName)
        {
                const parameters = action.parameters;
                const name = parameters.name;
                const newName = store.nameScratchpad.get(name);

                const narratives = store.narratives;
                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const message = messages.get(name);
                const newMessage = message.set('name', newName);
                const tempMessages = messages.set(newName, newMessage);
                const newMessages = tempMessages.delete(name);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                const scratchpad = store.nameScratchpad;
                const newScratchpad = scratchpad.delete(name);

                return store.set('narratives', newNarratives)
                        .set('nameScratchpad', newScratchpad)
                        .set('activeMessage', newName);
        }

        function setMessageProperty (
                name: string,
                propertyName: string,
                propertyValue: any,
                store: Im.Store)
        {
                const narratives = store.narratives;
                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const message = messages.get(name);
                const newMessage = message.set(propertyName, propertyValue);
                const newMessages = messages.set(name, newMessage);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = narratives.set(
                        narrative.name, newNarrative);

                return Im.Store({
                        activeNarrative: store.activeNarrative,
                        activeMessage: store.activeMessage,
                        narratives: newNarratives,
                        edges: store.edges,
                        nameScratchpad: store.nameScratchpad,
                });
        }

        export function handleSetMessageSubject (
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
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
                store: Im.Store,
                config: Im.Config,
                action: Actions.SetString)
        {
                const parameters = action.parameters;
                const name = parameters.name;
                const value = parameters.value;

                const narrative = Im.getActiveNarrative(store);
                const strings = narrative.strings;
                const newStrings = strings.set(name, value);

                const newNarrative = narrative.set('strings', newStrings);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                return Im.Store({
                        activeNarrative: store.activeNarrative,
                        activeMessage: store.activeMessage,
                        narratives: newNarratives,
                        edges: store.edges,
                        nameScratchpad: store.nameScratchpad,
                });
        }
}
