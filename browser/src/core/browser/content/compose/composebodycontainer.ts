import ActionCreators = require('../../../action/actioncreators');
import Draft = require('../../../draft');
import ComposeBody = require('./composebody');
import React = require('react');
import Redux = require('../../../redux/redux');

interface ComposeBodyContainerProps extends React.Props<any> {
        draft: Draft.Draft;
}

function renderComposeBodyContainer(props: ComposeBodyContainerProps)
{
        return ComposeBody({
                draft: props.draft,
                onChange: onChange,
                onKeyDown: onKeyDown,
        });
}

const ComposeBodyContainer = React.createFactory(renderComposeBodyContainer);

function onChange (e: KeyboardEvent, body: string)
{
        e.stopPropagation();

        const action = ActionCreators.setDraftBody(body);
        Redux.handleAction(action);
}

function onKeyDown (e: KeyboardEvent)
{
        if (e.keyCode === 27) {
                e.stopPropagation();
                const action = ActionCreators.endEditBody();
                Redux.handleAction(action);
        }
}

export = ComposeBodyContainer;
