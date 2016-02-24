/// <reference path="../dumb/menubar.ts" />

module Component {
        interface MenuBarContainerInt {
                narrativeNames: Immutable.List<string>;
                activeNarrative: string;
        };
        export type MenuBarContainerData = Immutable.Record.IRecord<MenuBarContainerInt>;
        export const MenuBarContainerData = Immutable.Record<MenuBarContainerInt>({
                narrativeNames: Immutable.List<string>(),
                activeNarrative: null,
        }, 'MenuBarContainer');

        export type MenuBarContainerProps = Flux.Props<MenuBarContainerData>;

        function render (props: MenuBarContainerProps)
        {
                const data = props.data;
                const menuBarData = MenuBarData({
                        narrativeNames: data.narrativeNames,
                        activeNarrative: data.activeNarrative,
                        onAddMessage: onAddMessage,
                        onSelectNarrative: onSelectNarrative,
                });
                return MenuBar(menuBarData);
        }

        export const MenuBarContainer = Flux.createFactory(render, 'MenuBarContainer');

        function onAddMessage ()
        {
                const action = Action.createMessage();
                Flux.handleAction(action);
        }

        function onSelectNarrative (name: string)
        {
                const action = Action.setActiveNarrative(name);
                Flux.handleAction(action);
        }
}
