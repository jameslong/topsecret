import ActionCreators = require('../../action/actioncreators');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditArea = require('../dumb/editarea');

type EditAreaContainerProps = ReactUtils.Props<State.Store>;

function render (props: EditAreaContainerProps)
{
        const data = props.data;
        const narrativeId = data.ui.activeNarrativeId;
        const editAreaData = EditArea.EditAreaData({
                store: data,
                onClick: (e: MouseEvent) => onClick(narrativeId, e),
        });
        return EditArea.EditArea(editAreaData);
}

export const EditAreaContainer = ReactUtils.createFactory(render, 'EditAreaContainer');

function onClick (narrativeId: string, e: MouseEvent)
{
        e.stopPropagation();

        const action = ActionCreators.deselectAllMessages(narrativeId);
        Redux.handleAction(action);
}
