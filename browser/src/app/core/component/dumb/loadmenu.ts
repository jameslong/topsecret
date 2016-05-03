import React = require('react');
import SelectableRows = require('./selectablerows');

interface LoadProps extends React.Props<any> {
        activeIndex: number;
        saves: string[];
}

function renderLoad(props: LoadProps)
{
        const highlightedIndices: number[] = [];
        const rowData = props.saves.map(item => [item]);
        const selectedIndex = props.activeIndex;
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const Load = React.createFactory(renderLoad);

export = Load;
