import Helpers = require('../../utils/helpers');
import Map = require('../../map/map');
import React = require('react');
import Str = require('../../utils/string');

import Core = require('../core');
import Table = Core.Table;
import TBody = Core.TBody;
import TD = Core.TD;
import TR = Core.TR;

interface SelectableRowsProps extends React.Props<any> {
        rowDataById: Map.Map<string[]>;
        selectedId: string;
        highlightedIds: string[];
}

function renderSelectableRows(props: SelectableRowsProps)
{
        const selectedId = props.selectedId;
        const highlightedIds = props.highlightedIds;
        const rowDataById = props.rowDataById;

        const rows = Helpers.arrayFromMap(rowDataById, (cells, id) =>
                createRow(cells, id, selectedId, highlightedIds));

        return Table({ className: 'selectable-rows' }, TBody({}, rows));
}

const SelectableRows = React.createFactory(renderSelectableRows);

function createRow (
        cells: string[],
        id: string,
        selectedId: string,
        highlightedIds: string[])
{
        const selected = id === selectedId;
        const highlighted = highlightedIds.indexOf(id) !== -1;
        const className = Str.concatClassNames({
                ['selectable-rows-selected']: selected,
                ['selectable-rows-highlighted']: highlighted,
        });

        const tds = cells.map((cellData, index) => TD({ key: index }, cellData));
        return TR({ className, key: id }, tds);
}

export = SelectableRows;
