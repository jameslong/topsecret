import React = require('react');
import Core = require('../common/core');
import TextArea = Core.TextArea;

interface OnChange {
        (e: KeyboardEvent, value: string): void;
}

interface TextAreaProps extends React.Props<any> {
        placeholder: string;
        value: string;
        onChange: OnChange;
        onKeyDown?: OnChange
        className?: string;
        autofocus?: boolean;
};

function renderTextArea(props: TextAreaProps)
{
        const onChange = (e: KeyboardEvent) => {
                props.onChange(e, <string>((<any>e.target).value));
        };

        return TextArea({
                placeholder: props.placeholder,
                value: props.value,
                onChange: onChange,
                onKeyDown: props.onKeyDown,
                className: props.className,
                autoFocus: props.autofocus,
        });
}

const TextAreaInput = React.createFactory(renderTextArea);

export = TextAreaInput;
