import Command = require('../../command');
import Data = require('../../data');
import Helpers = require('../../../../../../core/src/app/utils/helpers');
import React = require('react');
import SelectableRows = require('./selectablerows');

interface HelpProps extends React.Props<any> {
        commands: Command.Command[];
}

function renderHelp(props: HelpProps)
{
        const selectedId: string = null;
        const commands = props.commands;
        const highlightedIds: string[] = [];

        const rowDataById = Helpers.mapFromArray(
                commands, Data.getId, createRowData);

        return SelectableRows({ rowDataById, selectedId, highlightedIds });
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
