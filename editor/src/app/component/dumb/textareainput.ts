module TextAreaInput {
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

        export type TextAreaProps = Redux.Props<TextAreaData>;

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

                return Core.TextArea({
                        placeholder: data.placeholder,
                        value: data.value,
                        onChange: onChange,
                        className: data.className,
                });
        }

        export const TextAreaInput = Redux.createFactory(render, 'TextAreaInput');
}
