/// <reference path="../dumb/menubar.ts" />

module MenuBarContainer {
        interface MenuBarContainerInt {
                narrativeNames: Immutable.List<string>;
                activeNarrative: string;
                activeMessage: string;
        };
        export type MenuBarContainerData = Immutable.Record.IRecord<MenuBarContainerInt>;
        export const MenuBarContainerData = Immutable.Record<MenuBarContainerInt>({
                narrativeNames: Immutable.List<string>(),
                activeNarrative: null,
                activeMessage: null,
        }, 'MenuBarContainer');

        export type MenuBarContainerProps = Redux.Props<MenuBarContainerData>;

        function render (props: MenuBarContainerProps)
        {
                const data = props.data;
                const version = data.activeNarrative;
                const activeMessage = data.activeMessage;
                const onTestLocal = () => onTest(version, activeMessage);

                const menuBarData = MenuBar.MenuBarData({
                        narrativeNames: data.narrativeNames,
                        activeNarrative: data.activeNarrative,
                        activeMessage,
                        onAddMessage,
                        onTest: onTestLocal,
                        onSelectNarrative,
                });
                return MenuBar.MenuBar(menuBarData);
        }

        export const MenuBarContainer = Redux.createFactory(render, 'MenuBarContainer');

        function onAddMessage ()
        {
                const action = ActionCreators.createMessage();
                Redux.handleAction(action);
        }

        function onSelectNarrative (name: string)
        {
                const action = ActionCreators.setActiveNarrative(name);
                Redux.handleAction(action);
        }

        function onTest (version: string, messageName: string)
        {
                const clientURL = '../client/index.html';
                const querystring =
                        `?version=${version}&messageName=${messageName}`;
                const url = `${clientURL}${querystring}`;
                window.open(url);
        }
}
