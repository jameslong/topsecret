import ActionCreators = require('../../action/actioncreators');
import Immutable = require('immutable');
import Message = require('../../message');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');

import NodeComponent = require('../dumb/node');

interface NodeContainerInt {
        message: Message.Message;
        narrativeId: string;
};
export type NodeContainerData = Immutable.Record.IRecord<NodeContainerInt>;
export const NodeContainerData = Immutable.Record<NodeContainerInt>({
        message: Message.Message(),
        narrativeId: '',
}, 'NodeContainerData');

type NodeContainerProps = ReactUtils.Props<NodeContainerData>;


function render (props: NodeContainerProps)
{
        const data = props.data;
        const narrativeId = data.narrativeId;
        const message = data.message;
        const name = message.name;
        const selected = message.selected;

        const onClickLocal = (event: MouseEvent) =>
                onClick(narrativeId, name, selected, event);
        const nodeData = NodeComponent.NodeData({
                message: message,
                onClick: onClickLocal,
        });

        return NodeComponent.Node(nodeData);
}

export const NodeContainer = ReactUtils.createFactory(render, 'NodeContainer');

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
