import Message = require('../../message');
import React = require('react');

import Core = require('../common/core');
import Div = Core.Div;
import Span = Core.Span;

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
                        Span({}, `-*-NSA Mail: =${folderName}`)),
                Div({ className: 'infobar-major' },
                        Span({}, `[Msgs: ${numMessages}`),
                        Span({}, `New: ${numNewMessages}`),
                        Span({}, `Old: ${numOldMessages}]`)
                )
        );
}

const FooterIndex = React.createFactory(renderFooterIndex);

export = FooterIndex;
