import ActionCreators = require('../../action/actioncreators');
import Immutable = require('immutable');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import MenuBar = require('../dumb/menubar');

interface MenuBarContainerInt {
        narrativeNames: Immutable.List<string>;
        activeNarrativeId: string;
        activeMessageId: string;
};
export type MenuBarContainerData = Immutable.Record.IRecord<MenuBarContainerInt>;
export const MenuBarContainerData = Immutable.Record<MenuBarContainerInt>({
        narrativeNames: Immutable.List<string>(),
        activeNarrativeId: null,
        activeMessageId: null,
}, 'MenuBarContainer');

export type MenuBarContainerProps = ReactUtils.Props<MenuBarContainerData>;

function render (props: MenuBarContainerProps)
{
        const data = props.data;
        const version = data.activeNarrativeId;
        const activeMessageId = data.activeMessageId;
        const narrativeId = data.activeNarrativeId;
        const onTestLocal = () => onTest(version, activeMessageId);

        const menuBarData = MenuBar.MenuBarData({
                narrativeNames: data.narrativeNames,
                activeNarrativeId: narrativeId,
                activeMessageId,
                onAddMessage: () => onAddMessage(narrativeId),
                onTest: onTestLocal,
                onSelectNarrative,
        });
        return MenuBar.MenuBar(menuBarData);
}

export const MenuBarContainer = ReactUtils.createFactory(render, 'MenuBarContainer');

function onAddMessage (narrativeId: string)
{
        const action = ActionCreators.createMessage(narrativeId);
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
