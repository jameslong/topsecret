import Actions = require('../../actions/actions');
import EditBar = require('./editbar');
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

function onChange (e: KeyboardEvent, to: string)
{
        e.stopPropagation();
        const action = Actions.setDraftTo(to);
        Redux.handleAction(action);
}

export = EditTo;
