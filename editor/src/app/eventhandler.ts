import ActionCreators = require('./action/actioncreators');
import Message = require('./message');
import Redux = require('./redux/redux');
import State = require('./state');

export function addKeyHandlers (getStateFn: () => State.State)
{
        window.onkeydown = (e: KeyboardEvent) => onKeyDown(e, getStateFn());
}

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
        const action = ActionCreators.undo();
        Redux.handleAction(action);
}

function onRedo ()
{
        const action = ActionCreators.redo();
        Redux.handleAction(action);
}

function onDelete (state: State.State)
{
        const present = state.present;
        const narrativeId = present.ui.activeNarrativeId;
        const messages = present.data.narrativesById[narrativeId].messagesById;
        const namesMap = Message.getSelectedMessages(messages);
        const names = Object.keys(namesMap);
        const params = { names, narrativeId };
        const action = ActionCreators.deleteMessages(params);
        Redux.handleAction(action);
}
