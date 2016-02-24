import React = require('react');

interface SelectInputProps extends React.Props<any> {
        value: string;
        options: string[];
        onChange: (value: string) => void;
};

interface InputEvent {
        target: {
                value: string;
        }
}

function renderSelectInput(props: SelectInputProps)
{
        const data = props.data;
        const onChange = (event: InputEvent) =>
                data.onChange(event.target.value);

        const options = createOptions(data.options);

        return Select({
                value: data.value,
                onChange: onChange,
        }, options);
}

const SelectInput = React.createFactory(renderSelectInput);

function createOptions (options: Immutable.List<string>)
{
        return options.map(option => Option({
                value: option,
                key: option,
         }, option));
}

export = SelectInput;
