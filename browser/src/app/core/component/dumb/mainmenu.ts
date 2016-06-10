import Map = require('../../../../../../core/src/app/utils/map');
import Menu = require('../../menu');
import React = require('react');
import SelectableRows = require('./selectablerows');

interface MainMenuProps extends React.Props<any> {
        activeMainMenuIndex: number;
        menuItems: string[];
        menuItemsById: Map.Map<Menu.Item>;
}

function renderMainMenu(props: MainMenuProps)
{
        const menuItemsById = props.menuItemsById;
        const menuItems = props.menuItems.map(id => menuItemsById[id]);
        const highlightedIndices: number[] = [];
        const rowData = menuItems.map(item => [item.text]);
        const selectedIndex = props.activeMainMenuIndex;
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const MainMenu = React.createFactory(renderMainMenu);

export = MainMenu;
