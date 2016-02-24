/// <reference path="../dumb/buttoninput.ts" />
/// <reference path="../dumb/selectinput.ts" />

module Component {
        interface MenuBarInt {
                narrativeNames: Immutable.List<string>;
                activeNarrative: string;
                onAddMessage: () => void;
                onSelectNarrative: (name: string) => void;
        };
        export type MenuBarData = Immutable.Record.IRecord<MenuBarInt>;
        export const MenuBarData = Immutable.Record<MenuBarInt>({
                narrativeNames: Immutable.List<string>(),
                activeNarrative: null,
                onAddMessage: () => {},
                onSelectNarrative: () => {},
        }, 'MenuBar');

        export type MenuBarProps = Flux.Props<MenuBarData>;

        function render (props: MenuBarProps)
        {
                const data = props.data;
                const narrativeNames = data.narrativeNames;
                const activeNarrative = data.activeNarrative;

                const narrativeSelect = createNarrativeSelect(
                        data.onSelectNarrative,
                        narrativeNames,
                        activeNarrative);
                const addMessage = createAddMessage(data.onAddMessage);

                return Div({ className: 'menu-bar' },
                        narrativeSelect, addMessage);
        }

        export const MenuBar = Flux.createFactory(render, 'MenuBar');

        function createAddMessage (onAddMessage: () => void)
        {
                const deleteProps = ButtonData({
                        text: 'Message +',
                        disabled: false,
                        onClick: onAddMessage,
                        className: null,
                });
                return ButtonInput(deleteProps);
        }

        function createNarrativeSelect (
                onSelectNarrative: (name: string) => void,
                names: Immutable.List<string>,
                active: string)
        {
                const groupProps = SelectInputData({
                        onChange: onSelectNarrative,
                        options: names,
                        value: active,
                });
                return SelectInput(groupProps);
        }
}
