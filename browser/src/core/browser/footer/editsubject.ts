import Actions = require('../../actions/actions');
import EditBar = require('./editbar');
import React = require('react');
import Redux = require('../../redux/redux');

interface EditSubjectProps extends React.Props<any> {
        value: string;
}

function renderEditSubject(props: EditSubjectProps)
{
        const value = props.value;
        return EditBar({
                placeholder: '',
                defaultValue: value,
                label: 'Subject',
                onChange: onChange,
        });
}

const EditSubject = React.createFactory(renderEditSubject);

function onChange (e: KeyboardEvent, subject: string)
{
        e.stopPropagation();

        const action = Actions.setDraftSubject(subject);
        Redux.handleAction(action);
}

export = EditSubject;
