import Helpers = require('../common/helpers');
import Message = require('../../message');
import React = require('react');
import Str = require('../../../../../core/src/utils/string');

import Core = require('../common/core');
import Div = Core.Div;

interface MetaProps extends React.Props<any> {
        message: Message.Message;
        utcOffsetHours: number;
}

function renderMeta(props: MetaProps)
{
        const message = props.message;
        const offset = props.utcOffsetHours;
        const date = Helpers.wrapInLabel('Date',
                Message.getDisplayDate(message.date, offset));
        const from = Helpers.wrapInLabel('From', message.from);
        const to = Helpers.wrapInLabel('To', message.to);
        const subject = Helpers.wrapInLabel('Subject', message.subject);
        const attachmentName = message.attachment ?
                Str.removePath(message.attachment) : '';
        const attachment = attachmentName ?
                Helpers.wrapInLabel('Attachment(s)', attachmentName) :
                null;
        const body = message.body;

        return Div({ className: 'meta' },
                Div({ className: 'meta-date' }, date),
                Div({ className: 'meta-from' }, from),
                Div({ className: 'meta-to' }, to),
                Div({ className: 'meta-subject' }, subject),
                Div({ className: 'meta-attachment' }, attachment)
        );
}

const Meta = React.createFactory(renderMeta);

export = Meta;
