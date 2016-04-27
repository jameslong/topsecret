import Message = require('../../message');
import React = require('react');

import Core = require('../core');
import Div = Core.Div;
import Span = Core.Span;

interface FooterComposeProps extends React.Props<any> {
        draftBody: string;
}

function renderFooterCompose(props: FooterComposeProps)
{
        const body = props.draftBody;
        const bodySize = Message.getDisplaySize(body);
        return Div({},
                Div({ className: 'infobar-major' }, `-- NSA Mail: Compose`),
                Div({ className: 'infobar-major' },
                        `[Approx. msg size ${bodySize}`,
                        `Atts: 0]`
                )
        );
}

const FooterCompose = React.createFactory(renderFooterCompose);

export = FooterCompose;
