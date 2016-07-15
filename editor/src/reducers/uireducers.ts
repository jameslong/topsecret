import Actions = require('../actions/actions');
import Config = require('../config');
import Helpers = require('./../../../core/src/utils/helpers');
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

        case Actions.Types.DELETE_MESSAGES:
                const deleteMessages = <Actions.DeleteMessages><any>action;
                return handleDeleteMessages(state, config, deleteMessages);

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
        return Helpers.assign(state, { activeNarrativeId: name });
}

function handleOpenMessage (
        state: State.UI,
        config: Config.Config,
        action: Actions.OpenMessage)
{
        const name = action.parameters;
        return Helpers.assign(state, { activeMessageId: name });
}

function handleCloseMessage (
        state: State.UI,
        config: Config.Config,
        action: Actions.CloseMessage)
{
        return Helpers.assign(state, { activeMessageId: null });
}

function handleDeleteMessages (
        state: State.UI,
        config: Config.Config,
        action: Actions.DeleteMessages)
{
        return Helpers.assign(state, { activeMessageId: null });
}

function handleSetMessageName (
        state: State.UI,
        config: Config.Config,
        action: Actions.SetMessageName)
{
        const name = action.parameters.name;
        const newName = action.parameters.value;
        return (state.activeMessageId === name) ?
                Helpers.assign(state, { activeMessageId: newName }) :
                state;
}
