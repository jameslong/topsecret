module Component {
        interface TextListInt {
                placeholder: string;
                values: Immutable.List<string>;
                onChange: (values: Immutable.List<string>) => void;
                className?: string;
        };
        export type TextListData = Immutable.Record.IRecord<TextListInt>;
        export const TextListData = Immutable.Record<TextListInt>({
                placeholder: '',
                values: Immutable.List<string>(),
                onChange: () => {},
                className: undefined,
        }, 'TextList');

        interface InputEvent {
                target: {
                        value: string;
                }
        }

        export type TextListProps = Redux.Props<TextListData>;

        function render (props: TextListProps)
        {
                const data = props.data;
                const onChange = (event: InputEvent) => {
                        const value = event.target.value;
                        const values = splitToString(value);
                        data.onChange(values);
                };
                const value = data.values.join();

                return Core.Input({
                        placeholder: data.placeholder,
                        value: value,
                        onChange: onChange,
                        className: data.className,
                });
        }

        export const TextList = Redux.createFactory(render, 'TextList');

        function splitToString (newValue: string)
        {
                if (newValue) {
                        const values = newValue.split(',');
                        return Immutable.List.of<string>(...values);
                } else {
                        return Immutable.List<string>();
                }
        }
}
