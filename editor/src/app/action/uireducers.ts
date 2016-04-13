import Actions = require('./actions');
import Config = require('../config');
import Redux = require('../redux/redux');
import State = require('../state');

export function ui (
        state: State.UI, config: Config.Config, action: Redux.Action<any>)
{
        switch (action.type) {
        case Actions.Types.SET_ACTIVE_NARRATIVE:
                const setActive = <Actions.SetActiveNarrative><any>action;
                return handleSetActiveNarrative(state, config, setActive);

        case Actions.Types.OPEN_MESSAGE:
                const open = <Actions.OpenMessage><any>action;
                return handleOpenMessage(state, config, open);

        case Actions.Types.CLOSE_MESSAGE:
                const close = <Actions.CloseMessage><any>action;
                return handleCloseMessage(state, config, close);

        case Actions.Types.DELETE_MESSAGE:
                const deleteMessage = <Actions.DeleteMessage><any>action;
                return handleDeleteMessage(state, config, deleteMessage);

        case Actions.Types.SET_MESSAGE_NAME:
                const setName = <Actions.SetMessageName><any>action;
                return handleSetMessageName(state, config, setName);

        default:
                return state;
        }
}

function handleSetActiveNarrative (
        state: State.UI,
        config: Config.Config,
        action: Actions.SetActiveNarrative)
{
        const name = action.parameters;
        return state.set('activeNarrativeId', name);
}

function handleOpenMessage (
        state: State.UI,
        config: Config.Config,
        action: Actions.OpenMessage)
{
        const name = action.parameters;
        return state.set('activeMessageId', name);
}

function handleCloseMessage (
        state: State.UI,
        config: Config.Config,
        action: Actions.CloseMessage)
{
        return state.set('activeMessageId', null);
}

function handleDeleteMessage (
        state: State.UI,
        config: Config.Config,
        action: Actions.DeleteMessage)
{
        const name = action.parameters.name;
        return (state.activeMessageId === name) ?
                state.set('activeMessageId', null) : state;
}

function handleSetMessageName (
        state: State.UI,
        config: Config.Config,
        action: Actions.SetMessageName)
{
        const name = action.parameters.name;
        const newName = action.parameters.value;
        return (state.activeMessageId === name) ?
                state.set('activeMessageId', newName) : state;
}
