import React = require('react');

import Core = require('../core');
import Input = Core.Input;

interface OnChange {
        (e: KeyboardEvent, value: string): void;
}
interface ConfirmTextProps extends React.Props<any> {
        placeholder: string;
        defaultValue: string;
        onChange: OnChange;
        className?: string;
        autofocus?: boolean;
};

function renderConfirmText(props: ConfirmTextProps)
{
        const onChange = (e: KeyboardEvent) =>
                onKeyDown(e, props.onChange);

        return Input({
                placeholder: props.placeholder,
                defaultValue: props.defaultValue,
                onKeyDown: onChange,
                onClick: onClick,
                className: props.className,
                autoFocus: props.autofocus,
        });
}

const ConfirmText = React.createFactory(renderConfirmText);

function onKeyDown (e: KeyboardEvent, onChange: OnChange)
{
        if (e.keyCode === 13 || e.keyCode === 27) {
                const value = <string>((<any>e.target).value);
                onChange(e, value);
        }
}

function onClick (e: MouseEvent)
{
        e.stopPropagation();
}

export = ConfirmText;
