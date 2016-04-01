/// <reference path="../core.ts" />
/// <reference path="../smart/editareacontainer.ts" />
/// <reference path="../smart/editpanelcontainer.ts" />
/// <reference path="../smart/menubarcontainer.ts" />

module Root {
        type RootProps = Redux.Props<State.State>;

        function render (props: RootProps)
        {
                const state = props.data;
                const store = State.getActiveStore(state);
                const narrativeNames = Helpers.keys(store.narratives);

                const activeNarrative = store.activeNarrative;
                const activeMessage = store.activeMessage;

                const message = activeMessage ?
                        EditPanelContainer.EditPanelContainer(store) : null;

                const narrative = Narrative.getActiveNarrative(store);
                const messages = narrative.messages;
                const singleSelected = Message.getSingleSelectedMessage(messages);

                const menuBarData = MenuBarContainer.MenuBarContainerData({
                        narrativeNames,
                        activeNarrative,
                        activeMessage: singleSelected,
                });

                return Core.Div({ className: 'root' },
                        EditAreaContainer.EditAreaContainer(store),
                        MenuBarContainer.MenuBarContainer(menuBarData),
                        message
                );
        }

        export const Root = Redux.createFactory(render, 'Root');

}
