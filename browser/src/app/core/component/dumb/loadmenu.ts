import Menu = require('../../menu');
import React = require('react');
import SelectableRows = require('./selectablerows');

interface LoadProps extends React.Props<any> {
        activeIndex: number;
        saves: Menu.LoadMenuItem[];
}

function renderLoad(props: LoadProps)
{
        const { activeIndex, saves } = props;
        const highlightedIndices: number[] = [];
        const rowData = saves.map(item => [item.text]);
        const selectedIndex = activeIndex;
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const Load = React.createFactory(renderLoad);

export = Load;
