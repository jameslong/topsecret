import React = require('react');

import Core = require('../core');
import Div = Core.Div;
import ButtonInput = require('./buttoninput');

interface MultipleProps extends React.Props<any> {
        children: React.ReactElement<any>[];
        onAdd: () => void;
        onRemove: (index: number) => void;
};

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

function renderMultiple (props: MultipleProps)
{
        const children = props.children;
        const wrappedChildren = children.map((child, index) =>
                wrapChild(props.onRemove, child, index));

        const addFn = (e: Event) => onAdd(props.onAdd, e);
        const enabled = true;
        const addProps = {
                text: '+',
                disabled: !enabled,
                onClick: addFn,
                className: 'button-add',
        };
        const add = ButtonInput(addProps);

        return Div({}, wrappedChildren, add);
}

const Multiple = React.createFactory(renderMultiple);

function wrapChild (
        removeFn: (index: number) => void,
        child: React.ReactElement<any>,
        index: number)
{
        const removeProps = {
                text: 'x',
                disabled: false,
                onClick: (e: Event) => onRemove(removeFn, e, index),
                className: 'button-remove',
        };
        const remove = ButtonInput(removeProps);

        return Div({ className: 'multiple-child', key: index },
                child, remove);
}

export = Multiple;
