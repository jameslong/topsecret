module EventHandler {
        export function addKeyHandlers ()
        {
                window.onkeydown = onKeyDown;
        }

        function onKeyDown (e: KeyboardEvent)
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
                }
        }

        function onUndo ()
        {
                const action = Action.undo();
                Flux.handleAction(action);
        }

        function onRedo ()
        {
                const action = Action.redo();
                Flux.handleAction(action);
        }
}
