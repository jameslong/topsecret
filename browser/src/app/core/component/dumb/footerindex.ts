import Message = require('../../message');
import React = require('react');

import Core = require('../core');
import Div = Core.Div;

interface FooterIndexProps extends React.Props<any> {
        folderName: string;
        messages: Message.Message[];
}

function renderFooterIndex(props: FooterIndexProps)
{
        const folderName = props.folderName.toUpperCase();

        const messages = props.messages;
        const numMessages = messages.length;
        const numOldMessages = messages.filter(Message.isRead).length;
        const numNewMessages = numMessages - numOldMessages;

        return Div({},
                Div({ className: 'infobar-major' },
                        `-*-NSA Mail: =${folderName}`),
                Div({ className: 'infobar-major' },
                        `[Msgs: ${numMessages}`,
                        `New: ${numNewMessages}`,
                        `Old: ${numOldMessages}]`
                )
        );
}

const FooterIndex = React.createFactory(renderFooterIndex);

export = FooterIndex;
