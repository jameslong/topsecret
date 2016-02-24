import ActionCreators = require('../../action/actioncreators');
import EditBar = require('../dumb/editbar');
import React = require('react');
import Redux = require('../../redux/redux');

interface EditToProps extends React.Props<any> {
        value: string;
}

function renderEditTo(props: EditToProps)
{
        const value = props.value;
        return EditBar({
                placeholder: '',
                defaultValue: value,
                label: 'To',
                onChange: onChange,
        });
}

const EditTo = React.createFactory(renderEditTo);

function onChange (e: KeyboardEvent, toString: string)
{
        e.stopPropagation();

        const to = toString.split(',');
        const action = ActionCreators.setDraftTo(to);
        Redux.handleAction(action);
}

export = EditTo;
