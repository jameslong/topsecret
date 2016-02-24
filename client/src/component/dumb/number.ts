import React = require('react');

interface NumberProps extends React.Props<any> {
        placeholder: number;
        value: number;
        onChange: (value: number) => void;
};

interface NumberEvent {
        target: {
                value: string;
        }
}

function renderNumber(props: NumberProps)
{
        const onChange = (event: NumberEvent) => {
                const value = parseFloat(event.target.value);
                return props.onChange(value);
        };

        return Input({
                placeholder: props.placeholder,
                value: props.value,
                onChange: onChange,
                type: 'number',
        });
}

const Number = React.createFactory(renderNumber);

export = Number;
