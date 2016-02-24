module Component {
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
        }, 'TextArea');

        export type TextAreaProps = Flux.Props<TextAreaData>;

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

        export const TextAreaInput = Flux.createFactory(render, 'TextArea');
}
