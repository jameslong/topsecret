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
        cursorPosition?: number;
};

const TextAreaInputClass = React.createClass({
        componentDidMount: function() {
                const props: TextAreaProps = this.props;
                const cursorPosition = props.cursorPosition;
                if (cursorPosition !== undefined) {
                        const textArea = this.textArea;
                        textArea.selectionStart = cursorPosition;
                        textArea.selectionEnd = cursorPosition;
                }
        },

        render: function () {
                const props: TextAreaProps = this.props;
                const onChange = (e: KeyboardEvent) => {
                        props.onChange(e, <string>((<any>e.target).value));
                };
                const ref = (textArea: any) => this.textArea = textArea;

                return TextArea({
                        placeholder: props.placeholder,
                        value: props.value,
                        onChange: onChange,
                        onKeyDown: props.onKeyDown,
                        className: props.className,
                        autoFocus: props.autofocus,
                        ref: ref,
                });
        },
});
const TextAreaInput = React.createFactory(TextAreaInputClass);
export = TextAreaInput;
