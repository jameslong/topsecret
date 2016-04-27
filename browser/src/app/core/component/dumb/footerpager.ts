import Message = require('../../message');
import React = require('react');

import Core = require('../core');
import Div = Core.Div;
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
        return Div({},
                Div({ className: 'infobar-major' },
                        Span({}, `${activeIndex}/${numMessages}`)),
                Div({ className: 'infobar-major' }, Span({}, from)),
                Div({ className: 'infobar-major' }, Span({}, subject))
        );
}

const FooterPager = React.createFactory(renderFooterPager);

export = FooterPager;
