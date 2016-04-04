import Immutable = require('immutable');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Div = Core.Div;
import ButtonInput = require('./buttoninput');

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

type MultipleProps = ReactUtils.Props<MultipleData>;

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
        const addProps = ButtonInput.ButtonData({
                text: '+',
                disabled: !enabled,
                onClick: addFn,
                className: 'button-add',
        });
        const add = ButtonInput.ButtonInput(addProps);

        return Div({}, wrappedChildren, add);
}

export const Multiple = ReactUtils.createFactory(render, 'Multiple');

function wrapChild (
        removeFn: (index: number) => void,
        child: React.ReactElement<any>,
        index: number)
{
        const removeProps = ButtonInput.ButtonData({
                text: 'x',
                disabled: false,
                onClick: (e: Event) => onRemove(removeFn, e, index),
                className: 'button-remove',
        });
        const remove = ButtonInput.ButtonInput(removeProps);

        return Div({ className: 'multiple-child', key: index },
                child, remove);
}
