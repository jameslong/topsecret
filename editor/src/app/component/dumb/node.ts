/// <reference path="absolute.ts" />
/// <reference path="../smart/draggable.ts" />

module Component {
        interface NodeInt {
                message: Im.Message;
                onClick: (e: MouseEvent) => void;
        };
        export type NodeData = Immutable.Record.IRecord<NodeInt>;
        export const NodeData = Immutable.Record<NodeInt>({
                message: Im.Message(),
                onClick: () => {},
        }, 'Node');

        type NodeProps = Redux.Props<NodeData>;

        function render (props: NodeProps)
        {
                const data = props.data;
                const message = props.data.message;
                const name = message.name;
                const position = message.position;
                const nameProps = Im.Value({
                        value: name,
                });
                const selected = message.selected;
                const invalid = !message.valid;
                const className = Redux.classNames(
                        'node',
                        { ['node-selected']: selected },
                        { ['node-invalid']: invalid });

                const nodeProps = {
                        className: className,
                        onClick: data.onClick,
                };

                return Absolute(position,
                        Draggable(nameProps,
                                Div(nodeProps,
                                        Div({ className: 'node-title' },
                                                name)
                                )
                        )
                );
        }

        export const Node = Redux.createFactory(render, 'Node');
}
