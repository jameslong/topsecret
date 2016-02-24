module Component {
        interface TextInt {
                placeholder: string;
                value: string;
                onChange: (value: string) => void;
                list?: string;
                className?: string;
        };
        export type TextData = Immutable.Record.IRecord<TextInt>;
        export const TextData = Immutable.Record<TextInt>({
                placeholder: '',
                value: '',
                onChange: (value: string) => {},
                list: undefined,
                className: undefined,
        }, 'Text');

        export type TextProps = Flux.Props<TextData>;

        interface InputEvent {
                target: {
                        value: string;
                }
        }

        function render (props: TextProps)
        {
                const data = props.data;
                const onChange = (event: InputEvent) =>
                        data.onChange(event.target.value);

                return Input({
                        placeholder: data.placeholder,
                        value: data.value,
                        onChange: onChange,
                        list: data.list,
                        className: data.className,
                });
        }

        export const Text = Flux.createFactory(render, 'Text');
}
