module Component {
        interface CheckboxInt {
                checked: boolean;
                onChange: (value: boolean) => void;
        };
        export type CheckboxData = Immutable.Record.IRecord<CheckboxInt>;
        export const CheckboxData = Immutable.Record<CheckboxInt>({
                checked: false,
                onChange: (value: boolean) => {},
        }, 'Checkbox');

        type CheckboxProps = Flux.Props<CheckboxData>;

        interface CheckEvent {
                target: {
                        checked: boolean;
                }
        }

        function render (props: CheckboxProps)
        {
                const data = props.data;
                const onChange = (event: CheckEvent) =>
                        data.onChange(event.target.checked);

                return Input({
                        type: 'checkbox',
                        checked: data.checked,
                        onChange: onChange,
                });
        }

        export const Checkbox = Flux.createFactory(render, 'Checkbox');
}
