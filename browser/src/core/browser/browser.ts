import ActionCreators = require('../action/actioncreators');
import Command = require('../command');
import Data = require('../data');
import React = require('react');
import Redux = require('../redux/redux');
import Client = require('../client');
import UI = require('../ui');

import Core = require('./common/core');
import Div = Core.Div;
import Img = Core.Img;

import Content = require('./dumb/content');
import FeedbackButton = require('./dumb/feedbackbutton');
import Footer = require('./footer/footer');
import NewGame = require('./dumb/newgame');
import NewGameLoading = require('./dumb/newgameloading');
import Header = require('./header/header');

interface BrowserProps extends React.Props<any> {
        state: Client.Client;
}

function renderBrowser(props: BrowserProps): React.ReactElement<any>
{
        const state = props.state;
        if (state.ui.mode === UI.Modes.NEW_GAME) {
                return NewGame({ state });
        } else if (state.ui.mode === UI.Modes.NEW_GAME_LOADING) {
                const loadingInfo = state.ui.loadingInfo;
                return NewGameLoading({ loadingInfo });
        } else {
                return renderGame(state);
        }
}

const Browser = React.createFactory(renderBrowser);

function renderGame (state: Client.Client)
{
        const commands = Client.getActiveCommands(state);
        const displayedCommands = commands.filter(
                command => command.shortDesc.length > 0);

        const header = Header({ commands: displayedCommands });
        const footer = Footer({ state });
        const content = Content({ state });
        const feedback = FeedbackButton({ openExternal: state.openExternal });
        const fastforward = state.data.clock.timeFactor > 1 ?
                Div({ className: 'browser-fastforward' }) : null;

        return Div({ className: 'browser', onClick },
                header, content, footer, feedback, fastforward);
}

function onClick (e: MouseEvent)
{
        const action = ActionCreators.blur();
        Redux.handleAction(action);
}

export = Browser;
