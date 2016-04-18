import React = require('react');

import Core = require('../core');
import TextArea = Core.TextArea;

interface TextAreaProps extends React.Props<any> {
        placeholder: string;
        value: string;
        onChange: (value: string) => void;
        className?: string;
};

interface InputEvent {
        target: {
                value: string;
        }
}

function renderTextArea (props: TextAreaProps)
{
        const onChange = (event: InputEvent) =>
                props.onChange(event.target.value);

        return TextArea({
                placeholder: props.placeholder,
                value: props.value,
                onChange: onChange,
                className: props.className,
        });
}

const TextAreaInput = React.createFactory(renderTextArea);

export = TextAreaInput;
