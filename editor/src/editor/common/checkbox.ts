import React = require('react');

import Core = require('./core');
import Input = Core.Input;

interface CheckboxProps extends React.Props<any> {
        checked: boolean;
        onChange: (value: boolean) => void;
};

interface CheckEvent {
        target: {
                checked: boolean;
        }
}

function renderCheckbox (props: CheckboxProps)
{
        const onChange = (event: CheckEvent) =>
                props.onChange(event.target.checked);

        return Input({
                type: 'checkbox',
                checked: props.checked,
                onChange: onChange,
        });
}

const Checkbox = React.createFactory(renderCheckbox);

export = Checkbox;
