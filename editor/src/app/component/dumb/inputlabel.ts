///<reference path='../../misc.ts'/>

module InputLabel {
        type InputLabelProps = Redux.Props<Misc.KeyValue>;

        function render (props: InputLabelProps)
        {
                const label = props.data.value;

                const labelName = Core.Div({ className: 'label-name' },
                        label);
                const labelValue = Core.Div({ className: 'label-value' },
                        props.children);

                return Core.Label({ className: 'label' },
                        labelName, labelValue);
        }

        export const InputLabel = Redux.createFactory(render, 'InputLabel');
}
