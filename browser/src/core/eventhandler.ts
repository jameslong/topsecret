import Actions = require('./action/actions');
import Redux = require('./redux/redux');

export function addKeyHandlers ()
{
        window.onkeydown = onKeyDown;
}

function onKeyDown (e: KeyboardEvent)
{
        const action = Actions.keyDown(e);
        Redux.handleAction(action);
}
