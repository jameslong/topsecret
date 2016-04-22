import React = require('react');

interface OnChange {
        (e: KeyboardEvent, value: string): void;
}

interface TextAreaProps extends React.Props<any> {
        placeholder: string;
        value: string;
        onChange: OnChange;
        className?: string;
        autofocus?: boolean;
};

function renderTextArea(props: TextAreaProps)
{
        const onChange = (e: KeyboardEvent) =>
                props.onChange(e, <string>((<any>event.target).value));

        return TextArea({
                placeholder: props.placeholder,
                value: props.value,
                onChange: onChange,
                className: props.className,
                autoFocus: props.autofocus,
        });
}

const TextAreaInput = React.createFactory(renderTextArea);

export = TextAreaInput;
