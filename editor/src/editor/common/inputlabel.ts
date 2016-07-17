import React = require('react');

import Core = require('./core');
import Div = Core.Div;
import Label = Core.Label;

interface InputLabelProps extends React.Props<any> {
        name: string;
        value: string;
}

function renderInputLabel (props: InputLabelProps)
{
        const label = props.value;

        const labelName = Div({ className: 'label-name' }, label);
        const labelValue = Div({ className: 'label-value' },
                props.children);

        return Label({ className: 'label' }, labelName, labelValue);
}

const InputLabel = React.createFactory(renderInputLabel);

export = InputLabel;
