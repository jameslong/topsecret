import ActionCreators = require('../../action/actioncreators');
import Command = require('../../command');
import Data = require('../../data');
import React = require('react');
import Redux = require('../../redux/redux');
import Client = require('../../client');

import Core = require('../core');
import Div = Core.Div;

import Content = require('../dumb/content');
import Footer = require('../dumb/footer');
import Header = require('../dumb/header');

interface RootProps extends React.Props<any> {
        state: Client.Client;
}

function renderRoot(props: RootProps)
{
        const state = props.state;
        const commands = Client.getActiveCommands(state);

        const header = createHeader(state.ui.mode, commands);
        const footer = Footer({ state });
        const content = Content({ state });

        return Div({ className: 'root', onClick }, header, content, footer);
}

const Root = React.createFactory(renderRoot);

function onClick (e: MouseEvent)
{
        const action = ActionCreators.blur();
        Redux.handleAction(action);
}

function createHeader (mode: string, commands: Command.Command[])
{
        const data = commands.map(Command.getCommandSummary);
        return Header({ values: data });
}

export = Root;
