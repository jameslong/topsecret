import ActionCreators = require('../../action/actioncreators');
import Command = require('../../command');
import Data = require('../../data');
import React = require('react');
import Redux = require('../../redux/redux');
import Client = require('../../client');
import UI = require('../../ui');

import Core = require('../core');
import Div = Core.Div;

import Content = require('../dumb/content');
import FeedbackButton = require('../dumb/feedbackbutton');
import Footer = require('../dumb/footer');
import NewGame = require('../dumb/newgame');
import Header = require('../dumb/header');

interface RootProps extends React.Props<any> {
        state: Client.Client;
}

function renderRoot(props: RootProps): React.ReactElement<any>
{
        const state = props.state;
        if (state.ui.mode === UI.Modes.NEW_GAME) {
                return NewGame({ state });
        } else {
                return renderGame(state);
        }
}

const Root = React.createFactory(renderRoot);

function renderGame (state: Client.Client)
{
        const commands = Client.getActiveCommands(state);
        const displayedCommands = commands.filter(
                command => command.shortDesc.length > 0);

        const header = createHeader(state.ui.mode, displayedCommands);
        const footer = Footer({ state });
        const content = Content({ state });
        const feedback = FeedbackButton({});

        return Div({ className: 'root', onClick },
                header, content, footer, feedback);
}

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
