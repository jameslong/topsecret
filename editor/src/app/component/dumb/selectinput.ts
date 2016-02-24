module Component {
        interface SelectInputInt {
                value: string;
                options: Immutable.List<string>;
                onChange: (value: string) => void;
        };
        export type SelectInputData = Immutable.Record.IRecord<SelectInputInt>;
        export const SelectInputData = Immutable.Record<SelectInputInt>({
                value: null,
                options: Immutable.List<string>(),
                onChange: (value: string) => {},
        }, 'SelectInput');

        export type SelectInputProps = Flux.Props<SelectInputData>;

        interface InputEvent {
                target: {
                        value: string;
                }
        }

        function render (props: SelectInputProps)
        {
                const data = props.data;
                const onChange = (event: InputEvent) =>
                        data.onChange(event.target.value);

                const options = createOptions(data.options);

                return Select({
                        value: data.value,
                        onChange: onChange,
                }, options);
        }

        export const SelectInput = Flux.createFactory(render, 'SelectInput');

        function createOptions (options: Immutable.List<string>)
        {
                return options.map(option => Option({
                        value: option,
                        key: option,
                 }, option));
        }
}
