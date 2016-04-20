import Actions = require('./actions');
import Config = require('../config');
import Edge = require('../edge');
import Helpers = require('./../../../../core/src/app/utils/helpers');
import Map = require('./../../../../core/src/app/utils/map');
import MathUtils = require('../math');
import Message = require('../message');
import Narrative = require('../narrative');
import Redux = require('../redux/redux');
import State = require('../state');

export function data (
        state: State.Data, config: Config.Config, action: Redux.Action<any>)
{
        switch (action.type) {
        case Actions.Types.END_DRAG:
                const endDrag = <Actions.EndDrag><any>action;
                return handleEndDrag(state, config, endDrag);

        case Actions.Types.SET_ACTIVE_NARRATIVE:
                const setActive = <Actions.SetActiveNarrative><any>action;
                return handleSetActiveNarrative(state, config, setActive);

        case Actions.Types.CLOSE_MESSAGE:
                const close = <Actions.CloseMessage><any>action;
                return handleCloseMessage(state, config, close);

        case Actions.Types.CREATE_MESSAGE:
                const create = <Actions.CreateMessage><any>action;
                return handleCreateMessage(state, config, create);

        case Actions.Types.DELETE_MESSAGE:
                const deleteMessage = <Actions.DeleteMessage><any>action;
                return handleDeleteMessage(state, config, deleteMessage);

        case Actions.Types.SELECT_MESSAGE:
                const select = <Actions.SelectMessage><any>action;
                return handleSelectMessage(state, config, select);

        case Actions.Types.UNIQUE_SELECT_MESSAGE:
                const uniqueSelect = <Actions.UniqueSelectMessage><any>action;
                return handleUniqueSelectMessage(state, config, uniqueSelect);

        case Actions.Types.DESELECT_MESSAGE:
                const deselect = <Actions.DeselectMessage><any>action;
                return handleDeselectMessage(state, config, deselect);

        case Actions.Types.DESELECT_ALL_MESSAGES:
                const deselectAll = <Actions.DeselectAllMessages><any>action;
                return handleDeselectAllMessages(state, config, deselectAll);

        case Actions.Types.SET_EDITED_MESSAGE_NAME:
                const setEditedName = <Actions.SetEditedMessageName><any>action;
                return handleSetEditedMessageName(state, config, setEditedName);

        case Actions.Types.SET_MESSAGE_NAME:
                const setName = <Actions.SetMessageName><any>action;
                return handleSetMessageName(state, config, setName);

        case Actions.Types.SET_MESSAGE_SUBJECT:
                const setSubject = <Actions.SetMessageSubject><any>action;
                return handleSetMessageSubject(state, config, setSubject);

        case Actions.Types.SET_MESSAGE_END_GAME:
                const setEndGame = <Actions.SetMessageEndGame><any>action;
                return handleSetMessageEndGame(state, config, setEndGame);

        case Actions.Types.SET_MESSAGE_ENCRYPTED:
                const setEncrypted = <Actions.SetMessageEncrypted><any>action;
                return handleSetMessageEncrypted(state, config, setEncrypted);

        case Actions.Types.SET_MESSAGE_SCRIPT:
                const setScript = <Actions.SetMessageScript><any>action;
                return handleSetMessageScript(state, config, setScript);

        case Actions.Types.SET_MESSAGE_POSITION:
                const setPosition = <Actions.SetMessagePosition><any>action;
                return handleSetMessagePosition(state, config, setPosition);

        case Actions.Types.SET_MESSAGE_CONTENT:
                const setContent = <Actions.SetMessageContent><any>action;
                return handleSetMessageContent(state, config, setContent);

        case Actions.Types.SET_MESSAGE_FALLBACK:
                const setFallback = <Actions.SetMessageFallback><any>action;
                return handleSetMessageFallback(state, config, setFallback);

        case Actions.Types.SET_MESSAGE_CHILDREN:
                const setChildren = <Actions.SetMessageChildren><any>action;
                return handleSetMessageChildren(state, config, setChildren);

        case Actions.Types.SET_MESSAGE_REPLY_OPTIONS:
                const setReplyOptions = <Actions.SetMessageReplyOptions><any>action;
                return handleSetMessageReplyOptions(state, config, setReplyOptions);

        case Actions.Types.SET_STRING:
                const setString = <Actions.SetString><any>action;
                return handleSetString(state, config, setString);

        default:
                return state;
        }
}

function handleEndDrag (
        state: State.Data,
        config: Config.Config,
        action: Actions.EndDrag)
{
        const gridSize = config.gridSize;
        const parameters = action.parameters;
        const name = parameters.id;
        const delta = parameters.delta;
        const narrativeId = parameters.narrativeId;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];
        const messages = narrative.messagesById;
        const message = messages[name];
        const selectedMessages: Map.Map<Message.Message> = message.selected ?
                Map.filter(messages, message => message.selected) :
                { [message.name]: message };

        const updatedMessages = Map.map(selectedMessages,
                message => updatePosition(delta, gridSize, message));
        const newMessages = Helpers.assign(messages, updatedMessages);
        const newNarrative = Helpers.assign(narrative,
                { messagesById: newMessages });
        const newNarratives = Helpers.assign(narratives,
                { [newNarrative.name]: newNarrative });
        const newEdges = Edge.createEdges(newMessages, config.vertexSize);

        return Helpers.assign(state, {
                narrativesById: newNarratives,
                edges: newEdges,
        });
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

        const newPosition = {
                x: roundedX,
                y: roundedY,
        };

        return Helpers.assign(message, { position: newPosition });
}

function roundToNearestMultiple (multiple: number, value: number)
{
        const diff = value % multiple;
        return (diff <= multiple / 2) ?
                value - diff :
                value + multiple - diff;
}

function handleSetActiveNarrative (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetActiveNarrative)
{
        const name = action.parameters;
        const narrative = state.narrativesById[name];
        const messages = narrative.messagesById;
        const newEdges = Edge.createEdges(messages, config.vertexSize);
        const newScratchpad: Map.Map<string> = {};
        return Helpers.assign(state, {
                edges: newEdges,
                nameScratchpad: newScratchpad,
        });
}

function handleCloseMessage (
        state: State.Data,
        config: Config.Config,
        action: Actions.CloseMessage)
{
        const narrativeId = action.parameters;
        return onNarrativeUpdate(state, narrativeId, config);
}

function onNarrativeUpdate (
        data: State.Data, narrativeId: string, config: Config.Config)
{
        const narratives = data.narrativesById;
        const narrative = narratives[narrativeId];
        const messages = narrative.messagesById;
        const newMessages = Message.markMessagesValid(
                messages, narrative.stringsById, narrative.profilesById);
        const newNarrative = Helpers.assign(narrative, {
                messagesById: newMessages });
        const newNarratives = Helpers.assign(narratives, {
                [narrativeId]: newNarrative });

        const newEdges = Edge.createEdges(newMessages, config.vertexSize);
        return Helpers.assign(data, {
                edges: newEdges,
                narrativesById: newNarratives,
        });
}

function handleCreateMessage (
        state: State.Data,
        config: Config.Config,
        action: Actions.CreateMessage)
{
        const narrativeId = action.parameters;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];
        const messages = narrative.messagesById;
        const name = Message.createUniqueMessageName(messages);
        const position = getCentrePosition();
        const newMessage: Message.Message = {
                name,
                threadSubject: '',
                position,
                endGame: false,
                message: {
                        from: '',
                        body: [''],
                },
                encrypted: true,
                script: '',
                receiver: null,
                replyOptions: [],
                children: [],
                fallback: null,
                selected: false,
                valid: false,

        };
        const newMessages = Helpers.assign(messages, { [name]: newMessage });
        const newNarrative = Helpers.assign(narrative,
                { messagesById: newMessages });
        const newNarratives = Helpers.assign(narratives,
                { [newNarrative.name]: newNarrative });
        return Helpers.assign(state, { narrativesById: newNarratives });
}

function getCentrePosition (): MathUtils.Coord
{
        const scrollX = window.scrollX;
        const scrollY = window.scrollY
        const width = window.innerWidth;
        const height = window.innerHeight;
        const centreX = Math.round(scrollX + (width / 2));
        const centreY = Math.round(scrollY + (height / 2));

        return {
                x: centreX,
                y: centreY,
        };
}

function handleDeleteMessage (
        state: State.Data,
        config: Config.Config,
        action: Actions.DeleteMessage)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const narrativeId = parameters.narrativeId;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];

        const newMessages = Map.remove(narrative.messagesById, name);
        const newNarrative = Helpers.assign(narrative,
                { messagesById: newMessages });
        const newNarratives = Helpers.assign(narratives,
                { [newNarrative.name]: newNarrative });
        const newData = Helpers.assign(state, { narrativesById: newNarratives });

        return onNarrativeUpdate(newData, narrativeId, config);
}

function handleSelectMessage (
        state: State.Data,
        config: Config.Config,
        action: Actions.SelectMessage)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const narrativeId = parameters.narrativeId;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];
        const messages = narrative.messagesById;

        const message = messages[name];
        const newMessage = Helpers.assign(message, { selected: true });
        const newMessages = Helpers.assign(messages, { [name]: newMessage });
        const newNarrative = Helpers.assign(narrative,
                { messagesById: newMessages });
        const newNarratives = Helpers.assign(narratives,
                { [newNarrative.name]: newNarrative });

        return Helpers.assign(state, { narrativesById: newNarratives });
}

function handleUniqueSelectMessage (
        state: State.Data,
        config: Config.Config,
        action: Actions.UniqueSelectMessage)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const narrativeId = parameters.narrativeId;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];
        const messages = Map.map(narrative.messagesById, message =>
                Helpers.assign(message, { selected: false }));

        const message = messages[name];
        const newMessage = Helpers.assign(message, { selected: true });
        const newMessages = Helpers.assign(messages, { [name]: newMessage });
        const newNarrative = Helpers.assign(narrative, { messagesById: newMessages });
        const newNarratives = Helpers.assign(narratives,
                { [newNarrative.name]: newNarrative });

        return Helpers.assign(state, { narrativesById: newNarratives });
}

function handleDeselectMessage (
        state: State.Data,
        config: Config.Config,
        action: Actions.DeselectMessage)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const narrativeId = parameters.narrativeId;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];

        const messages = narrative.messagesById;
        const message = messages[name];
        const updatedMessage = Helpers.assign(message, { selected: false });
        const updatedMessages = Helpers.assign(messages,
                { [updatedMessage.name]: updatedMessage });
        const newNarrative = Helpers.assign(narrative,
                { messagesById: updatedMessages });
        const newNarratives = Helpers.assign(narratives,
                { [newNarrative.name]: newNarrative });

        const newScratchpad = Map.filter(state.nameScratchpad,
                (newName, current) => name === current);

        return Helpers.assign(state, {
                narrativesById: newNarratives,
                nameScratchpad: newScratchpad,
        });
}

function handleDeselectAllMessages (
        state: State.Data,
        config: Config.Config,
        action: Actions.DeselectAllMessages)
{
        const narrativeId = action.parameters;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];
        const messages = narrative.messagesById;
        const updatedMessages = Map.map(messages, message =>
                Helpers.assign(message, { selected: false }));
        const newNarrative = Helpers.assign(narrative,
                { messagesById: updatedMessages });
        const newNarratives = Helpers.assign(narratives,
                { [newNarrative.name]: newNarrative });

        const newScratchpad: Map.Map<string> = {};

        return Helpers.assign(state, {
                narrativesById: newNarratives,
                nameScratchpad: newScratchpad,
        });
}

function handleSetEditedMessageName (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetEditedMessageName)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const newName = parameters.value;

        const scratchpad = state.nameScratchpad;
        const newScratchpad = Helpers.assign(scratchpad, { [name]: newName });
        return Helpers.assign(state, { nameScratchpad: newScratchpad });
}

function handleSetMessageName (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageName)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const newName = parameters.value;
        const narrativeId = parameters.narrativeId;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];

        const messages = narrative.messagesById;
        const message = messages[name];
        const newMessage = Helpers.assign(message, { name: newName });
        const tempMessages = Map.set(messages, newName, newMessage);
        const newMessages = Map.remove(tempMessages, name);
        const newNarrative = Helpers.assign(narrative,
                { messagesById: newMessages });
        const newNarratives = Map.set(
                narratives, newNarrative.name, newNarrative);

        const scratchpad = state.nameScratchpad;
        const newScratchpad = Map.remove(scratchpad, name);

        return Helpers.assign(state, {
                narrativesById: newNarratives, nameScratchpad: newScratchpad });
}

function setMessageProperty (
        name: string,
        propertyName: string,
        propertyValue: any,
        narrativeId: string,
        data: State.Data)
{
        const narratives = data.narrativesById;
        const narrative = narratives[narrativeId];
        const messages = narrative.messagesById;
        const message = messages[name];
        const newMessage = Helpers.assign(message,
                { [propertyName]: propertyValue });
        const newMessages = Map.set(messages, name, newMessage);
        const newNarrative = Helpers.assign(narrative,
                { messagesById: newMessages });
        const newNarratives =
                Map.set(narratives, newNarrative.name, newNarrative);
        return Helpers.assign(data, { narrativesById: newNarratives });
}

function handleSetMessageSubject (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageSubject)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'threadSubject',
                parameters.value,
                parameters.narrativeId,
                state);
}

function handleSetMessageEndGame (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageEndGame)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'endGame',
                parameters.value,
                parameters.narrativeId,
                state);
}

function handleSetMessageEncrypted (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageEncrypted)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'encrypted',
                parameters.value,
                parameters.narrativeId,
                state);
}

function handleSetMessageScript (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageScript)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'script',
                parameters.value,
                parameters.narrativeId,
                state);
}

function handleSetMessagePosition (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessagePosition)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'position',
                parameters.value,
                parameters.narrativeId,
                state);
}

function handleSetMessageContent (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageContent)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'message',
                parameters.value,
                parameters.narrativeId,
                state);
}

function handleSetMessageFallback (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageFallback)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'fallback',
                parameters.value,
                parameters.narrativeId,
                state);
}

function handleSetMessageChildren (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageChildren)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'children',
                parameters.value,
                parameters.narrativeId,
                state);
}
function handleSetMessageReplyOptions (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetMessageReplyOptions)
{
        const parameters = action.parameters;
        return setMessageProperty(
                parameters.name,
                'replyOptions',
                parameters.value,
                parameters.narrativeId,
                state);
}

function handleSetString (
        state: State.Data,
        config: Config.Config,
        action: Actions.SetString)
{
        const parameters = action.parameters;
        const name = parameters.name;
        const value = parameters.value;
        const narrativeId = parameters.narrativeId;
        const narratives = state.narrativesById;
        const narrative = narratives[narrativeId];
        const strings = narrative.stringsById;
        const newStrings = Map.set(strings, name, value);
        const newNarrative =
                Helpers.assign(narrative, { stringsById: newStrings });
        const newNarratives =
                Map.set(narratives, newNarrative.name, newNarrative);
        return Helpers.assign(state, { narrativesById: newNarratives });
}
