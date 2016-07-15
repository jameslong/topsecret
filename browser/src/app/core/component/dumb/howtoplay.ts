import Map = require('../../../../../../core/src/utils/map');
import Menu = require('../../menu');
import React = require('react');
import SelectableRows = require('./selectablerows');

import Core = require('../core');
const Br = Core.Br;
const Div = Core.Div;
const P = Core.P;

interface HowToPlayProps extends React.Props<any> {}

function renderHowToPlay(props: HowToPlayProps)
{
        const keyboardHeader = P({ className: 'how-to-play-header' }, `Keyboard only`);
        const keyboard = P({}, `NSANET is a terminal-based keyboard only application. Mouse input is NOT supported. Use the toolbar at the top of the application to see the available commands. Press the '?' key to bring up more information about the commands currently available.`);

        const replyingHeader = P({ className: 'how-to-play-header' }, `Replying`);
        const replying = P({},
                `When replying to messages from colleagues bear the following in mind:`,
                Br({}),
                Br({}),
                `- Only reply to messages which ask a direct question`,
                Br({}),
                `- Be unambiguous e.g. don't say yes and no in same message`);

        const fastforwardHeader = P({ className: 'how-to-play-header' }, `Fast-forward`);
        const fastforward = P({}, `When waiting for messages, you can speed things up by pressing the '+' key (fast-forward).`);

        return Div({ className: 'how-to-play' },
                keyboardHeader,
                keyboard,
                replyingHeader,
                replying,
                fastforwardHeader,
                fastforward);
}

const HowToPlay = React.createFactory(renderHowToPlay);

export = HowToPlay;
