import Immutable = require('immutable');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Div = Core.Div;
import Label = Core.Label;
import ButtonInput = require('./buttoninput');
import SelectInput = require('./selectinput');

interface MenuBarInt {
        narrativeNames: Immutable.List<string>;
        activeNarrativeId: string;
        activeMessageId: string;
        onAddMessage: () => void;
        onTest: () => void;
        onSelectNarrative: (name: string) => void;
};
export type MenuBarData = Immutable.Record.IRecord<MenuBarInt>;
export const MenuBarData = Immutable.Record<MenuBarInt>({
        narrativeNames: Immutable.List<string>(),
        activeNarrativeId: null,
        activeMessageId: null,
        onAddMessage: () => {},
        onTest: () => {},
        onSelectNarrative: () => {},
}, 'MenuBar');

export type MenuBarProps = ReactUtils.Props<MenuBarData>;

function render (props: MenuBarProps)
{
        const data = props.data;
        const narrativeNames = data.narrativeNames;
        const activeNarrative = data.activeNarrativeId;
        const activeMessage = data.activeMessageId;

        const narrativeSelect = createNarrativeSelect(
                data.onSelectNarrative,
                narrativeNames,
                activeNarrative);
        const addMessage = createAddMessage(data.onAddMessage);
        const test = createTest(activeMessage, data.onTest);

        return Div({ className: 'menu-bar' },
                narrativeSelect, addMessage, test);
}

export const MenuBar = ReactUtils.createFactory(render, 'MenuBar');

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
