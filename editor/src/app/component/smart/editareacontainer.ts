import ActionCreators = require('../../action/actioncreators');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditArea = require('../dumb/editarea');

type EditAreaContainerProps = ReactUtils.Props<State.Store>;

function render (props: EditAreaContainerProps)
{
        const data = props.data;
        const editAreaData = EditArea.EditAreaData({
                store: data,
                onClick: onClick,
        });
        return EditArea.EditArea(editAreaData);
}

export const EditAreaContainer = ReactUtils.createFactory(render, 'EditAreaContainer');

function onClick (event: MouseEvent)
{
        event.stopPropagation();

        const action = ActionCreators.deselectAllMessages();
        Redux.handleAction(action);
}
