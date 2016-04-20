import ActionCreators = require('../../action/actioncreators');
import Message = require('../../message');
import React = require('react');
import Redux = require('../../redux/redux');

import NodeComponent = require('../dumb/node');

interface NodeContainerProps extends React.Props<any> {
        message: Message.Message;
        narrativeId: string;
};

function renderNodeContainer (props: NodeContainerProps)
{
        const narrativeId = props.narrativeId;
        const message = props.message;
        const name = message.name;
        const selected = message.selected;

        const onClickLocal = (event: MouseEvent) =>
                onClick(narrativeId, name, selected, event);
        const nodeProps = {
                message: message,
                onClick: onClickLocal,
        };

        return NodeComponent(nodeProps);
}

const NodeContainer = React.createFactory(renderNodeContainer);

function onClick (
        narrativeId: string, name: string, selected: boolean, e: MouseEvent)
{
        e.stopPropagation();

        const groupSelect = e.ctrlKey;

        if (groupSelect) {
                if (selected) {
                        onDeselect(narrativeId, name);
                } else {
                        onSelect(narrativeId, name);
                }
        } else {
                if (selected) {
                        onDoubleClick(name);
                } else {
                        onUniqueSelect(narrativeId, name);
                }
        }
}

function onSelect (narrativeId: string, name: string)
{
        const action = ActionCreators.selectMessage({ name, narrativeId });
        Redux.handleAction(action);
}

function onDeselect (narrativeId: string, name: string)
{
        const action = ActionCreators.deselectMessage({ name, narrativeId });
        Redux.handleAction(action);
}

function onUniqueSelect (narrativeId: string, name: string)
{
        const action = ActionCreators.uniqueSelectMessage({ name, narrativeId });
        Redux.handleAction(action);
}

function onDoubleClick (name: string)
{
        const action = ActionCreators.openMessage(name);
        Redux.handleAction(action);
}

export = NodeContainer;
