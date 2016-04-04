import ActionCreators = require('../../action/actioncreators');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditPanel = require('../dumb/editpanel');

type EditPanelContainerProps = ReactUtils.Props<State.Store>;

function render (props: EditPanelContainerProps)
{
        const data = props.data;
        const editPanelData = EditPanel.EditPanelData({
                store: data,
                onClick: onClick,
        });
        return EditPanel.EditPanel(editPanelData);
}

export const EditPanelContainer = ReactUtils.createFactory(render, 'EditPanelContainer');

function onClick (e: MouseEvent)
{
        e.stopPropagation();

        const action = ActionCreators.closeMessage();
        Redux.handleAction(action);
}
