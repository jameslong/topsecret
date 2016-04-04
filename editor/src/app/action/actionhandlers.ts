///<reference path='../edge.ts'/>

module ActionHandlers {
        function setActiveNarrative (
                name: string, store: State.Store, config: Config.Config)
        {
                const narrative = store.narratives.get(name);
                const messages = narrative.messages;

                const newEdges = Edge.createEdges(
                        messages, config.vertexSize);
                const newScratchpad = Immutable.Map<string, string>();

                return State.Store({
                        activeNarrative: name,
                        activeMessage: store.activeMessage,
                        narratives: store.narratives,
                        edges: newEdges,
                        nameScratchpad: newScratchpad,
                });
        }

        export function handleSetGameData (
                state: State.State, action: Actions.SetGameData)
        {
                const narratives = action.parameters;
                const newNarratives = narratives.map(Narrative.markNarrativeValid);
                const store = State.getActiveStore(state);
                const tempStore = store.set('narratives', newNarratives);

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
                const messages = narrative.messages;
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
                const messages = narrative.messages;

                const updatedMessages = <Narrative.Messages>selectedMessages.map(
                        message => updatePosition(delta, gridSize, message));
                const newMessages = messages.merge(updatedMessages);

                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                const newEdges = Edge.createEdges(
                        newMessages, config.vertexSize);

                return State.Store({
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
                window.document.body.classList.add('open-modal');

                return store.set('activeMessage', name);
        }

        export function handleCloseMessage (
                store: State.Store,
                config: Config.Config,
                action: Actions.CloseMessage)
        {
                window.document.body.classList.remove('open-modal');
                const newStore = store.set('activeMessage', null);
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
                        previousStore.narratives,
                        currentStore.narratives);
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
                        previous.strings,
                        current.strings,
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
                const narratives = store.narratives;
                const activeNarrative = store.activeNarrative;
                const narrative = narratives.get(activeNarrative);
                const messages = narrative.messages;
                const newMessages = Message.markMessagesValid(
                        messages, narrative.strings, narrative.profiles);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = narratives.set(
                        activeNarrative, newNarrative);

                const newEdges = Edge.createEdges(
                        newMessages, config.vertexSize);
                return store.set('edges', newEdges)
                        .set('narratives', newNarratives);
        }

        export function handleCreateMessage (
                store: State.Store,
                config: Config.Config,
                action: Actions.CreateMessage)
        {
                const narrative = Narrative.getActiveNarrative(store);
                const messages = narrative.messages;
                const name = Message.createUniqueMessageName(messages);
                const newPosition = getCentrePosition();
                const tempMessage = Message.Message().
                        set('position', newPosition);
                const newMessage = tempMessage.set('name', name);
                const newMessages = messages.set(name, newMessage);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                return store.set('narratives', newNarratives);
        }

        export function handleDeleteMessage (
                store: State.Store,
                config: Config.Config,
                action: Actions.DeleteMessage)
        {
                const name = action.parameters;
                const narrative = Narrative.getActiveNarrative(store);

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
                store: State.Store,
                config: Config.Config,
                action: Actions.DeselectMessage)
        {
                const name = action.parameters;
                const narrative = Narrative.getActiveNarrative(store);
                const message = narrative.messages.get(name);
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
                const messages = narrative.messages;
                const selected = Message.getSelectedMessages(messages);
                return deselectMessages(selected, store);
        }

        export function deselectMessages (
                selected: Narrative.Messages, store: State.Store)
        {
                const narrative = Narrative.getActiveNarrative(store);

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
                const messages = narrative.messages;
                const selected = Message.getSelectedMessages(messages);
                const newStore = deselectMessages(selected, store);

                return selectMessage(name, newStore);
        }

        function selectMessage(name: string, store: State.Store)
        {
                const narrative = Narrative.getActiveNarrative(store);
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
                store: State.Store,
                config: Config.Config,
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
                store: State.Store,
                config: Config.Config,
                action: Actions.SetMessageName)
        {
                const parameters = action.parameters;
                const name = parameters.name;
                const newName = store.nameScratchpad.get(name);

                const narratives = store.narratives;
                const narrative = Narrative.getActiveNarrative(store);
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
                store: State.Store)
        {
                const narratives = store.narratives;
                const narrative = Narrative.getActiveNarrative(store);
                const messages = narrative.messages;
                const message = messages.get(name);
                const newMessage = message.set(propertyName, propertyValue);
                const newMessages = messages.set(name, newMessage);
                const newNarrative = narrative.set('messages', newMessages);
                const newNarratives = narratives.set(
                        narrative.name, newNarrative);

                return State.Store({
                        activeNarrative: store.activeNarrative,
                        activeMessage: store.activeMessage,
                        narratives: newNarratives,
                        edges: store.edges,
                        nameScratchpad: store.nameScratchpad,
                });
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
                const strings = narrative.strings;
                const newStrings = strings.set(name, value);

                const newNarrative = narrative.set('strings', newStrings);
                const newNarratives = store.narratives.set(
                        narrative.name, newNarrative);

                return State.Store({
                        activeNarrative: store.activeNarrative,
                        activeMessage: store.activeMessage,
                        narratives: newNarratives,
                        edges: store.edges,
                        nameScratchpad: store.nameScratchpad,
                });
        }
}
