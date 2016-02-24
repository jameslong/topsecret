module Component {
        interface NumberInt {
                placeholder: number;
                value: number;
                onChange: (value: number) => void;
        };
        export type NumberData = Immutable.Record.IRecord<NumberInt>;
        export const NumberData = Immutable.Record<NumberInt>({
                placeholder: 0,
                value: 0,
                onChange: (value: number) => {},
        }, 'Number');

        type NumberProps = Flux.Props<NumberData>;

        interface NumberEvent {
                target: {
                        value: string;
                }
        }

        function render (props: NumberProps)
        {
                const data = props.data;
                const onChange = (event: NumberEvent) => {
                        const value = parseFloat(event.target.value);
                        return data.onChange(value);
                };

                return Input({
                        placeholder: data.placeholder,
                        value: data.value,
                        onChange: onChange,
                        type: 'number',
                });
        }

        export const Number = Flux.createFactory(render, 'Number');
}
