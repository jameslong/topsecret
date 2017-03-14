import Actions = require('./actions/actions');
import Redux = require('./redux/redux');

export function addKeyHandlers ()
{
        window.onkeydown = onKeyDown;
}

function onKeyDown (e: KeyboardEvent)
{
        const copying =
                ((e.key === 'c' || e.keyCode === 67) && e.ctrlKey);

        if (!copying) {
                const action = Actions.keyDown(e);
                Redux.handleAction(action);
        }
}
