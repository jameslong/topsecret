import ActionCreators = require('../../action/actioncreators');
import Message = require('../../message');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');

import NodeComponent = require('../dumb/node');

type NodeContainerProps = ReactUtils.Props<Message.Message>;

function render (props: NodeContainerProps)
{
        const message = props.data;
        const name = message.name;
        const selected = message.selected;

        const onClickLocal = (event: MouseEvent) =>
                onClick(name, selected, event);
        const data = NodeComponent.NodeData({
                message: message,
                onClick: onClickLocal,
        });

        return NodeComponent.Node(data);
}

export const NodeContainer = ReactUtils.createFactory(render, 'NodeContainer');

function onClick (
        name: string, selected: boolean, event: MouseEvent)
{
        event.stopPropagation();

        const groupSelect = event.ctrlKey;

        if (groupSelect) {
                if (selected) {
                        onDeselect(name);
                } else {
                        onSelect(name);
                }
        } else {
                if (selected) {
                        onDoubleClick(name);
                } else {
                        onUniqueSelect(name);
                }
        }
}

function onSelect (name: string)
{
        const action = ActionCreators.selectMessage(name);
        Redux.handleAction(action);
}

function onDeselect (name: string)
{
        const action = ActionCreators.deselectMessage(name);
        Redux.handleAction(action);
}

function onUniqueSelect (name: string)
{
        const action = ActionCreators.uniqueSelectMessage(name);
        Redux.handleAction(action);
}

function onDoubleClick (name: string)
{
        const action = ActionCreators.openMessage(name);
        Redux.handleAction(action);
}
