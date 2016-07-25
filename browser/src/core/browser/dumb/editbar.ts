import ConfirmText = require('./confirmtext');
import React = require('react');

import Core = require('../common/core');
import Div = Core.Div;
import Span = Core.Span;

interface EditBarProps extends React.Props<any> {
        placeholder: string;
        defaultValue: string;
        label: string;
        onChange: (e: KeyboardEvent, value: string) => void;
};

function renderEditBar(props: EditBarProps)
{
        const text = createText(props);
        const label = Span({ className: 'edit-bar-label' },
                `${props.label}: `);

        return Div({ className: 'editbar' }, label, text);
}

const EditBar = React.createFactory(renderEditBar);

function createText (data: EditBarProps)
{
        return ConfirmText({
                placeholder: data.placeholder,
                defaultValue: data.defaultValue,
                onChange: data.onChange,
                autofocus: true,
        });
}

export = EditBar;
