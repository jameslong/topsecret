import Immutable = require('immutable');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import TextArea = Core.TextArea;

interface TextAreaInt {
        placeholder: string;
        value: string;
        onChange: (value: string) => void;
        className?: string;
};
export type TextAreaData = Immutable.Record.IRecord<TextAreaInt>;
export const TextAreaData = Immutable.Record<TextAreaInt>({
        placeholder: '',
        value: '',
        onChange: (value: string) => {},
        className: undefined,
}, 'TextAreaData');

export type TextAreaProps = ReactUtils.Props<TextAreaData>;

interface InputEvent {
        target: {
                value: string;
        }
}

function render (props: TextAreaProps)
{
        const data = props.data;
        const onChange = (event: InputEvent) =>
                data.onChange(event.target.value);

        return TextArea({
                placeholder: data.placeholder,
                value: data.value,
                onChange: onChange,
                className: data.className,
        });
}

export const TextAreaInput = ReactUtils.createFactory(render, 'TextAreaInput');
