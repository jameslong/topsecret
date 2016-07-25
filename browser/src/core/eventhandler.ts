import ActionCreators = require('./action/actioncreators');
import Redux = require('./redux/redux');

export function addKeyHandlers ()
{
        window.onkeydown = onKeyDown;
}

function onKeyDown (e: KeyboardEvent)
{
        const action = ActionCreators.keyDown(e);
        Redux.handleAction(action);
}
