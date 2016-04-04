import Immutable = require('immutable');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Button = Core.Button;

interface ButtonInt {
        text: string;
        disabled: boolean;
        onClick: (event: Event) => void;
        className: string;
};
export type ButtonData = Immutable.Record.IRecord<ButtonInt>;
export const ButtonData = Immutable.Record<ButtonInt>({
        text: '',
        disabled: false,
        onClick: () => {},
        className: null,
}, 'Button');

type ButtonInputProps = ReactUtils.Props<ButtonData>;

function render (props: ButtonInputProps)
{
        const data = props.data;
        const onClick = (event: Event) => data.onClick(event);

        return Button({
                disabled: data.disabled,
                onClick: onClick,
                className: data.className,
        }, data.text);
}

export const ButtonInput = ReactUtils.createFactory(render, 'ButtonInput');
