import ActionCreators = require('../../action/actioncreators');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditPanel = require('../dumb/editpanel');

type EditPanelContainerProps = ReactUtils.Props<State.Store>;

function render (props: EditPanelContainerProps)
{
        const data = props.data;
        const narrativeId = data.ui.activeNarrativeId;
        const editPanelData = EditPanel.EditPanelData({
                store: data,
                onClick: (e: MouseEvent) => onClick(narrativeId, e),
        });
        return EditPanel.EditPanel(editPanelData);
}

export const EditPanelContainer = ReactUtils.createFactory(render, 'EditPanelContainer');

function onClick (narrativeId: string, e: MouseEvent)
{
        e.stopPropagation();

        const action = ActionCreators.closeMessage(narrativeId);
        Redux.handleAction(action);
}
