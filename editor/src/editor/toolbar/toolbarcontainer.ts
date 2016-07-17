import Actions = require('../../actions/actions');
import React = require('react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import MenuBar = require('./toolbar');

interface MenuBarContainerProps extends React.Props<any> {
        narrativeNames: string[];
        activeNarrativeId: string;
        activeMessageId: string;
        saving: boolean;
};

function renderMenuBarContainer (props: MenuBarContainerProps)
{
        const version = props.activeNarrativeId;
        const activeMessageId = props.activeMessageId;
        const narrativeId = props.activeNarrativeId;
        const onTestLocal = () => onTest(version, activeMessageId);
        const saving = props.saving;

        const menuBarProps = {
                narrativeNames: props.narrativeNames,
                activeNarrativeId: narrativeId,
                activeMessageId,
                onAddMessage: () => onAddMessage(narrativeId),
                onTest: onTestLocal,
                onSelectNarrative,
                saving,
        };
        return MenuBar(menuBarProps);
}

const MenuBarContainer = React.createFactory(renderMenuBarContainer);

function onAddMessage (narrativeId: string)
{
        const action = Actions.createMessage(narrativeId);
        Redux.handleAction(action);
}

function onSelectNarrative (name: string)
{
        const action = Actions.setActiveNarrative(name);
        Redux.handleAction(action);
}

function onTest (version: string, messageName: string)
{
        const clientURL = '../../browser/build/index.html';
        const uiMode = 'INDEX_INBOX';
        const querystring = `?version=${version}&messageName=${messageName}&uiMode=${uiMode}`;
        const url = `${clientURL}${querystring}`;
        window.open(url);
}

export = MenuBarContainer;
