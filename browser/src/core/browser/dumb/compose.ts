import Draft = require('../../draft');
import Helpers = require('../helpers');
import Message = require('../../message');
import React = require('react');
import UI = require('../../ui');

import Core = require('../core');
import Div = Core.Div;

interface ComposeProps extends React.Props<any> {
        draft: Draft.Draft;
}

function renderCompose(props: ComposeProps)
{
        const draft = props.draft;
        const message = draft.content;

        const meta = createMeta(message);
        const body = Div({ className: 'compose-draft-body' },
                Helpers.createBody(draft.content.body));

        return Div({ className: 'compose' }, meta, body);
}

const Compose = React.createFactory(renderCompose);

function createMeta (message: Message.MessageContent)
{
        const from = Helpers.wrapInLabel('From', message.from);
        const to = Helpers.wrapInLabel('To', message.to);
        const subject = Helpers.wrapInLabel('Subject', message.subject);

        return Div({ className: 'meta' },
                Div({ className: 'meta-from' }, from),
                Div({ className: 'meta-to' }, to),
                Div({ className: 'meta-subject' }, subject)
        );
}

export = Compose;
