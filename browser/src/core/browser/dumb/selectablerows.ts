import Helpers = require('../../../../../core/src/utils/helpers');
import Map = require('../../../../../core/src/utils/map');
import React = require('react');
import Str = require('../../../../../core/src/utils/string');

import Core = require('../common/core');
import Table = Core.Table;
import TBody = Core.TBody;
import TD = Core.TD;
import TR = Core.TR;

interface SelectableRowsProps extends React.Props<any> {
        rowData: string[][];
        selectedIndex: number;
        highlightedIndices: number[];
}

function renderSelectableRows(props: SelectableRowsProps)
{
        const selectedIndex = props.selectedIndex;
        const highlighted = props.highlightedIndices;
        const rowData = props.rowData;

        const rows = rowData.map((cells, index) =>
                createRow(cells, index, selectedIndex, highlighted));

        return Table({ className: 'selectable-rows' }, TBody({}, rows));
}

const SelectableRows = React.createFactory(renderSelectableRows);

function createRow (
        cells: string[],
        index: number,
        selectedIndex: number,
        highlightedIndices: number[])
{
        const selected = index === selectedIndex;
        const highlighted = highlightedIndices.indexOf(index) !== -1;
        const className = Str.concatClassNames({
                ['selectable-rows-selected']: selected,
                ['selectable-rows-highlighted']: highlighted,
        });

        const tds = cells.map((cellData, index) => TD({ key: index }, cellData));
        return TR({ className, key: index }, tds);
}

export = SelectableRows;
