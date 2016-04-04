import Immutable = require('immutable');
import Message = require('../../message');
import Misc = require('../../misc');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Div = Core.Div;
import Absolute = require('./absolute');
import Draggable = require('../smart/draggable');

interface NodeInt {
        message: Message.Message;
        onClick: (e: MouseEvent) => void;
};
export type NodeData = Immutable.Record.IRecord<NodeInt>;
export const NodeData = Immutable.Record<NodeInt>({
        message: Message.Message(),
        onClick: () => {},
}, 'Node');

type NodeProps = ReactUtils.Props<NodeData>;

function render (props: NodeProps)
{
        const data = props.data;
        const message = props.data.message;
        const name = message.name;
        const position = message.position;
        const nameProps = Misc.Value({
                value: name,
        });
        const selected = message.selected;
        const invalid = !message.valid;
        const className = ReactUtils.classNames(
                'node',
                { ['node-selected']: selected },
                { ['node-invalid']: invalid });

        const nodeProps = {
                className: className,
                onClick: data.onClick,
        };

        return Absolute.Absolute(position,
                Draggable.Draggable(nameProps,
                        Div(nodeProps,
                                Div({ className: 'node-title' },
                                        name)
                        )
                )
        );
}

export const Node = ReactUtils.createFactory(render, 'Node');
