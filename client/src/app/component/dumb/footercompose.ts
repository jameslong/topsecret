import Message = require('../../message');
import React = require('react');

import Core = require('../core');
import Span = Core.Span;

interface FooterComposeProps extends React.Props<any> {
        draftBody: string;
}

function renderFooterCompose(props: FooterComposeProps)
{
        const body = props.draftBody;
        const bodySize = Message.getDisplaySize(body);
        return Span({},
                `-- NSA Mail: Compose`,
                Span({ className: 'infobar-major' }),
                `[Approx. msg size ${bodySize}`,
                Span({ className: 'infobar-minor' }),
                `Atts: 0]`);
}

const FooterCompose = React.createFactory(renderFooterCompose);

export = FooterCompose;
