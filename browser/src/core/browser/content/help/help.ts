import Command = require('../../../command');
import Data = require('../../../data');
import Helpers = require('../../../../../../core/src/utils/helpers');
import React = require('react');
import SelectableRows = require('../../common/selectablerows');

interface HelpProps extends React.Props<any> {
        commands: Command.Command[];
}

function renderHelp(props: HelpProps)
{
        const selectedIndex: number = null;
        const commands = props.commands;
        const highlightedIndices: number[] = [];

        const rowData = commands.map(createRowData);
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const Help = React.createFactory(renderHelp);

function createRowData (command: Command.Command)
{
        const key = command.key;
        const id = command.id;
        const desc = command.desc;
        return [key, id, desc];
}

export = Help;
