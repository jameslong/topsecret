import React = require('react');

import Core = require('../core');
import Div = Core.Div;
import Label = Core.Label;
import ButtonInput = require('./buttoninput');
import SelectInput = require('./selectinput');

interface MenuBarProps extends React.Props<any> {
        narrativeNames: string[];
        activeNarrativeId: string;
        activeMessageId: string;
        onAddMessage: () => void;
        onTest: () => void;
        onSelectNarrative: (name: string) => void;
        saving: boolean;
};

function renderMenuBar (props: MenuBarProps)
{
        const narrativeNames = props.narrativeNames;
        const activeNarrative = props.activeNarrativeId;
        const activeMessage = props.activeMessageId;

        const saveText = props.saving ? 'Saving...' : 'All changes saved';
        const saveStatus = Div({ className: 'menu-bar-save-status' }, saveText);
        const narrativeSelect = createNarrativeSelect(
                props.onSelectNarrative,
                narrativeNames,
                activeNarrative);
        const addMessage = createAddMessage(props.onAddMessage);
        const test = createTest(activeMessage, props.onTest);

        return Div({ className: 'menu-bar' },
                saveStatus, narrativeSelect, addMessage, test);
}

const MenuBar = React.createFactory(renderMenuBar);

function createAddMessage (onAddMessage: () => void)
{
        const className: string = null;
        const deleteProps = {
                text: 'Message +',
                disabled: false,
                onClick: onAddMessage,
                className,
        };
        return ButtonInput(deleteProps);
}

function createNarrativeSelect (
        onSelectNarrative: (name: string) => void,
        names: string[],
        active: string)
{
        const groupProps = {
                onChange: onSelectNarrative,
                options: names,
                value: active,
        };
        return SelectInput(groupProps);
}

function createTest (messageName: string, onClick: () => void)
{
        const disabled = !messageName;
        const props = {
                text: 'Test',
                disabled,
                onClick,
                className: <string>null,
        };
        return ButtonInput(props);
}

export = MenuBar;
