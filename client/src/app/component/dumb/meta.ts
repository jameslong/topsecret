import Helpers = require('../helpers');
import Message = require('../../message');
import React = require('react');

import Core = require('../core');
import Div = Core.Div;

interface MetaProps extends React.Props<any> {
        message: Message.Message;
}

function renderMeta(props: MetaProps)
{
        const message = props.message;
        const date = Helpers.wrapInLabel('Date',
                Message.getDisplayDate(message.date));
        const from = Helpers.wrapInLabel('From', message.from);
        const to = Helpers.wrapInLabel('To', message.to);
        const subject = Helpers.wrapInLabel('Subject', message.subject);
        const body = message.body;

        return Div({ className: 'meta' },
                Div({ className: 'meta-date' }, date),
                Div({ className: 'meta-from' }, from),
                Div({ className: 'meta-to' }, to),
                Div({ className: 'meta-subject' }, subject)
        );
}

const Meta = React.createFactory(renderMeta);

export = Meta;
