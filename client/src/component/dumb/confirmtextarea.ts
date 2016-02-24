import React = require('react');

import Core = require('../core');
import TextArea = Core.TextArea;

interface OnChange {
        (e: KeyboardEvent, value: string): void;
}

interface ConfirmTextAreaProps extends React.Props<any> {
        placeholder: string;
        value: string;
        onChange: OnChange;
        className?: string;
        autofocus?: boolean;
};

function renderConfirmTextArea(props: ConfirmTextAreaProps)
{
        const onChange = (e: KeyboardEvent) =>
                onKeyDown(e, props.onChange);

        return TextArea({
                placeholder: props.placeholder,
                defaultValue: props.value,
                onKeyDown: onChange,
                onClick,
                className: props.className,
                autoFocus: props.autofocus,
        });
}

const ConfirmTextArea = React.createFactory(renderConfirmTextArea);

function onKeyDown (e: KeyboardEvent, onChange: OnChange)
{
        if (e.keyCode === 27) {
                const value = <string>((<any>e.target).value);
                onChange(e, value);
        }
}

function onClick (e: MouseEvent)
{
        e.stopPropagation();
}

export = ConfirmTextArea;
