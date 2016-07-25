import React = require('react');

import Core = require('../core');
import Input = Core.Input;

interface TextProps extends React.Props<any> {
        placeholder: string;
        value: string;
        onChange: (e: KeyboardEvent, value: string) => void;
        name?: string;
        list?: string;
        className?: string;
};

function renderText(props: TextProps)
{
        const onChange = (e: KeyboardEvent) =>
                props.onChange(e, <string>(<any>e.target).value);

        return Input({
                placeholder: props.placeholder,
                value: props.value,
                onChange: onChange,
                name: props.name,
                list: props.list,
                className: props.className,
        });
}

const Text = React.createFactory(renderText);

export = Text;
