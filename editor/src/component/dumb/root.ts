/// <reference path="../core.ts" />
/// <reference path="../smart/editareacontainer.ts" />
/// <reference path="../smart/editpanelcontainer.ts" />
/// <reference path="../smart/menubarcontainer.ts" />

module Component {
        type RootProps = Flux.Props<Im.State>;

        function render (props: RootProps)
        {
                const state = props.data;
                const store = Im.getActiveStore(state);
                const narrativeNames = Im.keys(store.narratives);

                const activeMessage = store.activeMessage ?
                        EditPanelContainer(store) : null;

                const menuBarData = MenuBarContainerData({
                        narrativeNames: narrativeNames,
                        activeNarrative: store.activeNarrative,
                });

                return Div({ className: 'root' },
                        EditAreaContainer(store),
                        MenuBarContainer(menuBarData),
                        activeMessage
                );
        }

        export const Root = Flux.createFactory(render, 'Root');

}
