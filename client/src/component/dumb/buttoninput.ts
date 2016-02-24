import React = require('react');

interface ButtonProps extends React.Props<any> {
        text: string;
        disabled: boolean;
        onClick: (event: Event) => void;
        className: string;
};

function renderButton(props: ButtonProps)
{
        const onClick = (event: Event) => props.onClick(event);

        return Button({
                disabled: props.disabled,
                onClick: onClick,
                className: props.className,
        }, props.text);
}

const ButtonInput = React.createFactory(renderButton);

export = ButtonInput;
