import Actions = require('./actions/actions');
import Redux = require('./redux/redux');

export function addKeyHandlers ()
{
        window.onkeydown = onKeyDown;
}

function onKeyDown (e: KeyboardEvent)
{
        if (!(e.key === 'c' && e.ctrlKey)) {
                const action = Actions.keyDown(e);
                Redux.handleAction(action);
        }
}
