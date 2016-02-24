import React = require('react');

interface CheckboxProps extends React.Props<any> {
        checked: boolean;
        onChange: (value: boolean) => void;
};

interface CheckEvent {
        target: {
                checked: boolean;
        }
}

function render (props: CheckboxProps)
{
        const data = props.data;
        const onChange = (event: CheckEvent) =>
                data.onChange(event.target.checked);

        return Input({
                type: 'checkbox',
                checked: data.checked,
                onChange: onChange,
        });
}

const Checkbox = React.createFactory(render, 'Checkbox');

export = Checkbox;
