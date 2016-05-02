import Map = require('../../../../../../core/src/app/utils/map');
import React = require('react');
import SelectableRows = require('./selectablerows');

interface MainMenuProps extends React.Props<any> {
        activeMainMenuIndex: number;
        menuItems: string[];
}

function renderMainMenu(props: MainMenuProps)
{
        const menuItems = props.menuItems;
        const highlightedIndices: number[] = [];
        const rowData = menuItems.map(item => [item]);
        const selectedIndex = props.activeMainMenuIndex;
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const MainMenu = React.createFactory(renderMainMenu);

export = MainMenu;
