import React = require('react');
import SelectableRows = require('./selectablerows');

interface SaveProps extends React.Props<any> {
        activeIndex: number;
        saves: string[];
}

function renderSave(props: SaveProps)
{
        const highlightedIndices: number[] = [];
        const rowData = props.saves.map(item => [item]);
        rowData.push(['New Save']);
        const selectedIndex = props.activeIndex;
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const Save = React.createFactory(renderSave);

export = Save;
