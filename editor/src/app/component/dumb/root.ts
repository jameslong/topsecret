/// <reference path="../core.ts" />
/// <reference path="../smart/editareacontainer.ts" />
/// <reference path="../smart/editpanelcontainer.ts" />
/// <reference path="../smart/menubarcontainer.ts" />

module Component {
        type RootProps = Redux.Props<Im.State>;

        function render (props: RootProps)
        {
                const state = props.data;
                const store = Im.getActiveStore(state);
                const narrativeNames = Im.keys(store.narratives);

                const activeNarrative = store.activeNarrative;
                const activeMessage = store.activeMessage;

                const message = activeMessage ?
                        EditPanelContainer(store) : null;

                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const singleSelected = Im.getSingleSelectedMessage(messages);

                const menuBarData = MenuBarContainerData({
                        narrativeNames,
                        activeNarrative,
                        activeMessage: singleSelected,
                });

                return Div({ className: 'root' },
                        EditAreaContainer(store),
                        MenuBarContainer(menuBarData),
                        message
                );
        }

        export const Root = Redux.createFactory(render, 'Root');

}
