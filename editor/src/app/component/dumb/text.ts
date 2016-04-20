import React = require('react');

import Core = require('../core');
import Input = Core.Input;

interface TextProps extends React.Props<any> {
        placeholder: string;
        value: string;
        onChange: (value: string) => void;
        list?: string;
        className?: string;
};

interface InputEvent {
        target: {
                value: string;
        }
}

function renderText (props: TextProps)
{
        const onChange = (event: InputEvent) =>
                props.onChange(event.target.value);

        return Input({
                placeholder: props.placeholder,
                value: props.value,
                onChange: onChange,
                list: props.list,
                className: props.className,
        });
}

const Text = React.createFactory(renderText);

export = Text;
