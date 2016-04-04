import Misc = require('../../misc');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Div = Core.Div;
import Label = Core.Label;

type InputLabelProps = ReactUtils.Props<Misc.KeyValue>;

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

export const InputLabel = ReactUtils.createFactory(render, 'InputLabel');
