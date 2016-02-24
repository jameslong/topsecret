import ActionCreators = require('../../action/actioncreators');
import EditBar = require('../dumb/editbar');
import React = require('react');
import Redux = require('../../redux/redux');

interface EditDraftKeyNameProps extends React.Props<any> {
        value: string;
}

function renderEditDraftKeyName(props: EditDraftKeyNameProps)
{
        const value = props.value;
        return EditBar({
                placeholder: '',
                defaultValue: value,
                label: 'Name',
                onChange: onChange,
        });
}

const EditDraftKeyName = React.createFactory(renderEditDraftKeyName);

function onChange (e: KeyboardEvent, subject: string)
{
        e.stopPropagation();

        const action = ActionCreators.setDraftKeyName(subject);
        Redux.handleAction(action);
}

export = EditDraftKeyName;
