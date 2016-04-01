/// <reference path="buttoninput.ts" />

module Component {
        interface MultipleInt {
                children: Immutable.Iterable<number, any>;
                onAdd: () => void;
                onRemove: (index: number) => void;
        };
        export type MultipleData = Immutable.Record.IRecord<MultipleInt>;
        export const MultipleData = Immutable.Record<MultipleInt>({
                children: Immutable.List<React.ReactElement<any>>(),
                onAdd: () => {},
                onRemove: () => {},
        }, 'Multiple');

        type MultipleProps = Redux.Props<MultipleData>;

        function onAdd (addFn: () => void, e: Event)
        {
                e.stopPropagation();
                e.preventDefault();
                addFn();
        }

        function onRemove (
                removeFn: (index: number) => void,
                e: Event,
                index: number)
        {
                e.stopPropagation();
                e.preventDefault();
                removeFn(index);
        }

        function render (props: MultipleProps)
        {
                const data = props.data;

                const children = data.children;
                const wrappedChildren = children.map((child, index) =>
                        wrapChild(data.onRemove, child, index));

                const addFn = (e: Event) => onAdd(data.onAdd, e);
                const enabled = true;
                const addProps = ButtonData({
                        text: '+',
                        disabled: !enabled,
                        onClick: addFn,
                        className: 'button-add',
                });
                const add = ButtonInput(addProps);

                return Div({}, wrappedChildren, add);
        }

        export const Multiple = Redux.createFactory(render, 'Multiple');

        function wrapChild (
                removeFn: (index: number) => void,
                child: React.ReactElement<any>,
                index: number)
        {
                const removeProps = ButtonData({
                        text: 'x',
                        disabled: false,
                        onClick: (e: Event) => onRemove(removeFn, e, index),
                        className: 'button-remove',
                });
                const remove = ButtonInput(removeProps);

                return Div({ className: 'multiple-child', key: index },
                        child, remove);
        }
}
