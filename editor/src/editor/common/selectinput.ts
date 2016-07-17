import React = require('react');

import Core = require('./core');
import Option = Core.Option;
import Select = Core.Select;

interface SelectInputProps {
        value: string;
        options: string[];
        onChange: (value: string) => void;
};

interface InputEvent {
        target: {
                value: string;
        }
}

function renderSelectInput (props: SelectInputProps)
{
        const onChange = (event: InputEvent) =>
                props.onChange(event.target.value);

        const options = createOptions(props.options);

        return Select({
                value: props.value,
                onChange: onChange,
        }, options);
}

const SelectInput = React.createFactory(renderSelectInput);

function createOptions (options: string[])
{
        return options.map(option => Option({
                value: option,
                key: option,
         }, option));
}

export = SelectInput;
