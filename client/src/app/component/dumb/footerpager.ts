import Message = require('../../message');
import React = require('react');

import Core = require('../core');
import Span = Core.Span;

interface FooterPagerProps extends React.Props<any> {
        activeMessage: Message.Message;
        messages: string[];
}

function renderFooterPager(props: FooterPagerProps)
{
        const messages = props.messages;
        const activeMessage = props.activeMessage;
        const numMessages = messages.length;
        const activeIndex = messages.indexOf(activeMessage.id) + 1;
        const from = activeMessage.from;
        const subject = activeMessage.subject;
        return Span({},
                `${activeIndex}/${numMessages}`,
                Span({ className: 'infobar-major' }),
                from,
                Span({ className: 'infobar-major' }),
                subject);
}

const FooterPager = React.createFactory(renderFooterPager);

export = FooterPager;
