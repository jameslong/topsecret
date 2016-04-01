///<reference path='../../misc.ts'/>

module Component {
        type InputLabelProps = Flux.Props<Im.KeyValue>;

        function render (props: InputLabelProps)
        {
                const label = props.data.value;

                const labelName = Div({ className: 'label-name' },
                        label);
                const labelValue = Div({ className: 'label-value' },
                        props.children);

                return Label({ className: 'label' },
                        labelName, labelValue);
        }

        export const InputLabel = Flux.createFactory(render, 'InputLabel');
}
