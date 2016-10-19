import Map = require('../../../../../../core/src/utils/map');
import Menu = require('../../../menu');
import React = require('react');
import SelectableRows = require('../../common/selectablerows');

import Core = require('../../common/core');
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

        const playByEmailHeader = P({ className: 'how-to-play-header' }, `Play by email`);
        const playByEmail = P({},
                `To play by email, send a completed copy of the form below to careers@nsa.playtopsecret.com.`,
                Br({}),
                Br({}),
                `---- NSA Internal Transfer Request Form ---`,
                Br({}),
                Br({}),
                `First Name:`,
                Br({}),
                `Last Name:`,
                Br({}),
                `Use PGP Encryption (Y/N):`,
                Br({}),
                `UTC offset (hours): 0`,
                Br({}),
                `Security Key: `,
                Br({}),
                Br({}),
                `Please explain why you wish to join the Signals Intelligence division (200 words max):`,
                Br({}),
                Br({}),
                `Please note the contents of your application may be used for promotional and training purposes. All information is stored securely by the United States Office of Personnel Management.`,
                Br({}),
                `---`,
                Br({}),
                Br({}),
                `Your security key is available via the Humble Store, Itch.io or Kickstarter depending on how you purchased Top Secret.`);

        return Div({ className: 'how-to-play' },
                keyboardHeader,
                keyboard,
                replyingHeader,
                replying,
                fastforwardHeader,
                fastforward,
                playByEmailHeader,
                playByEmail);
}

const HowToPlay = React.createFactory(renderHowToPlay);

export = HowToPlay;
