import Menu = require('../../../menu');
import React = require('react');
import SelectableRows = require('../../dumb/selectablerows');

interface SaveProps extends React.Props<any> {
        activeIndex: number;
        saves: Menu.SaveMenuItem[];
}

function renderSave(props: SaveProps)
{
        const { activeIndex, saves } = props;
        const highlightedIndices: number[] = [];
        const rowData = saves.map(item => [item.text]);
        const selectedIndex = activeIndex;
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const Save = React.createFactory(renderSave);

export = Save;
