import ActionCreators = require('../../action/actioncreators');
import ConfirmTextArea = require('../dumb/confirmtextarea');
import React = require('react');
import Redux = require('../../redux/redux');

interface EditBodyProps extends React.Props<any> {
        value: string;
}

function renderEditBody(props: EditBodyProps)
{
        const value = props.value;
        return ConfirmTextArea({
                placeholder: '',
                value: value,
                onChange: onChange,
                autofocus: true,
        });
}

const EditBody = React.createFactory(renderEditBody);

function onChange (e: KeyboardEvent, body: string)
{
        e.stopPropagation();

        const action = ActionCreators.setDraftBody(body);
        Redux.handleAction(action);
}

export = EditBody;
