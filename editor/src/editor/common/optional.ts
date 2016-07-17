import React = require('react');

import Core = require('./core');
import Div = Core.Div;
import ButtonInput = require('./buttoninput');

interface OptionalProps extends React.Props<any> {
        child: React.ReactElement<any>;
        onAdd: () => void;
        onRemove: () => void;
};

function renderOptional (props: OptionalProps)
{
        const child = props.child;

        if (child) {
                const removeFn = props.onRemove;
                const onRemoveLocal = (event: Event) =>
                        onRemove(removeFn, event);
                const enabled = true;
                const removeProps = {
                        text: 'x',
                        disabled: !enabled,
                        onClick: onRemoveLocal,
                        className: 'button-remove',
                };
                const remove = ButtonInput(removeProps);

                return Div({}, child, remove);
        } else {
                const addFn = props.onAdd;
                const onAddLocal = (event: Event) =>
                        onAdd(addFn, event);
                const enabled = true;
                const addProps = {
                        text: '+',
                        disabled: !enabled,
                        onClick: onAddLocal,
                        className: 'button-add',
                };
                const add = ButtonInput(addProps);

                return Div({}, add);
        }
}

const Optional = React.createFactory(renderOptional);

function onAdd (addFn: () => void, event: Event)
{
        event.stopPropagation();
        event.preventDefault();
        addFn();
}

function onRemove (removeFn: () => void, event: Event)
{
        event.stopPropagation();
        event.preventDefault();
        removeFn();
}

export = Optional;
