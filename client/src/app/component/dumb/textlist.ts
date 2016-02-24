import React = require('react');

interface TextListProps extends React.Props<any> {
        placeholder: string;
        values: string[];
        onChange: (values: string[]) => void;
        className?: string;
};

interface InputEvent {
        target: {
                value: string;
        }
}

function renderTextList(props: TextListProps)
{
        const onChange = (event: InputEvent) => {
                const value = event.target.value;
                const values = splitToString(value);
                props.onChange(values);
        };
        const value = props.values.join();

        return Input({
                placeholder: props.placeholder,
                value: value,
                onChange: onChange,
                className: props.className,
        });
}

const TextList = React.createFactory(renderTextList);

function splitToString (newValue: string)
{
        if (newValue) {
                const values = newValue.split(',');
                return Immutable.List.of<string>(...values);
        } else {
                return Immutable.List<string>();
        }
}

export = TextList;
