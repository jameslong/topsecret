import Command = require('../../command');
import UnorderedList = require('../dumb/unorderedlist');
import React = require('react');

import Core = require('../common/core');
import Div = Core.Div;

interface HeaderProps extends React.Props<any> {
        commands: Command.Command[];
}

function renderHeader(props: HeaderProps)
{
        const contents = props.commands.map(Command.getCommandSummary);
        const ul = UnorderedList({ values: contents });
        return Div({ className: 'header' }, ul);
}

const Header = React.createFactory(renderHeader);

export = Header;
