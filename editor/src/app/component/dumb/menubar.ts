/// <reference path="../dumb/buttoninput.ts" />
/// <reference path="../dumb/selectinput.ts" />

module MenuBar {
        interface MenuBarInt {
                narrativeNames: Immutable.List<string>;
                activeNarrative: string;
                activeMessage: string;
                onAddMessage: () => void;
                onTest: () => void;
                onSelectNarrative: (name: string) => void;
        };
        export type MenuBarData = Immutable.Record.IRecord<MenuBarInt>;
        export const MenuBarData = Immutable.Record<MenuBarInt>({
                narrativeNames: Immutable.List<string>(),
                activeNarrative: null,
                activeMessage: null,
                onAddMessage: () => {},
                onTest: () => {},
                onSelectNarrative: () => {},
        }, 'MenuBar');

        export type MenuBarProps = Redux.Props<MenuBarData>;

        function render (props: MenuBarProps)
        {
                const data = props.data;
                const narrativeNames = data.narrativeNames;
                const activeNarrative = data.activeNarrative;
                const activeMessage = data.activeMessage;

                const narrativeSelect = createNarrativeSelect(
                        data.onSelectNarrative,
                        narrativeNames,
                        activeNarrative);
                const addMessage = createAddMessage(data.onAddMessage);
                const test = createTest(activeMessage, data.onTest);

                return Core.Div({ className: 'menu-bar' },
                        narrativeSelect, addMessage, test);
        }

        export const MenuBar = Redux.createFactory(render, 'MenuBar');

        function createAddMessage (onAddMessage: () => void)
        {
                const deleteProps = ButtonInput.ButtonData({
                        text: 'Message +',
                        disabled: false,
                        onClick: onAddMessage,
                        className: null,
                });
                return ButtonInput.ButtonInput(deleteProps);
        }

        function createNarrativeSelect (
                onSelectNarrative: (name: string) => void,
                names: Immutable.List<string>,
                active: string)
        {
                const groupProps = SelectInput.SelectInputData({
                        onChange: onSelectNarrative,
                        options: names,
                        value: active,
                });
                return SelectInput.SelectInput(groupProps);
        }

        function createTest (messageName: string, onClick: () => void)
        {
                const disabled = !messageName;
                const props = ButtonInput.ButtonData({
                        text: 'Test',
                        disabled,
                        onClick,
                        className: null,
                });
                return ButtonInput.ButtonInput(props);
        }
}
