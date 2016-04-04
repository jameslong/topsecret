import Immutable = require('immutable');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Div = Core.Div;
import ButtonInput = require('./buttoninput');

interface OptionalInt {
        child: React.ReactElement<any>;
        onAdd: () => void;
        onRemove: () => void;
};
export type OptionalData = Immutable.Record.IRecord<OptionalInt>;
export const OptionalData = Immutable.Record<OptionalInt>({
        child: null,
        onAdd: () => {},
        onRemove: () => {},
}, 'Optional');

type OptionalProps = ReactUtils.Props<OptionalData>;

function render (props: OptionalProps)
{
        const data = props.data;
        const child = data.child;

        if (child) {
                const removeFn = data.onRemove;
                const onRemoveLocal = (event: Event) =>
                        onRemove(removeFn, event);
                const enabled = true;
                const removeProps = ButtonInput.ButtonData({
                        text: 'x',
                        disabled: !enabled,
                        onClick: onRemoveLocal,
                        className: 'button-remove',
                });
                const remove = ButtonInput.ButtonInput(removeProps);

                return Div({}, child, remove);
        } else {
                const addFn = data.onAdd;
                const onAddLocal = (event: Event) =>
                        onAdd(addFn, event);
                const enabled = true;
                const addProps = ButtonInput.ButtonData({
                        text: '+',
                        disabled: !enabled,
                        onClick: onAddLocal,
                        className: 'button-add',
                });
                const add = ButtonInput.ButtonInput(addProps);

                return Div({}, add);
        }
}

export const Optional = ReactUtils.createFactory(render, 'Optional');

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
