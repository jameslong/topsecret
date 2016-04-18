import React = require('react');

import Core = require('../core');
import Button = Core.Button;

interface ButtonInputProps extends React.Props<any> {
        text: string;
        disabled: boolean;
        onClick: (event: Event) => void;
        className: string;
};

function renderButtonInput (props: ButtonInputProps)
{
        const onClick = (event: Event) => props.onClick(event);

        return Button({
                disabled: props.disabled,
                onClick: onClick,
                className: props.className,
        }, props.text);
}

const ButtonInput = React.createFactory(renderButtonInput);

export = ButtonInput;
