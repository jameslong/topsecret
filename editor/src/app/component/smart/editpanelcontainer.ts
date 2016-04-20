import ActionCreators = require('../../action/actioncreators');
import React = require('react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditPanel = require('../dumb/editpanel');

interface EditPanelContainerProps extends React.Props<any> {
        store: State.Store
}

function renderEditPanelContainer (props: EditPanelContainerProps)
{
        const store = props.store;
        const narrativeId = store.ui.activeNarrativeId;
        const editPanelProps = {
                store,
                onClick: (e: MouseEvent) => onClick(narrativeId, e),
        };
        return EditPanel(editPanelProps);
}

const EditPanelContainer = React.createFactory(renderEditPanelContainer);

function onClick (narrativeId: string, e: MouseEvent)
{
        e.stopPropagation();

        const action = ActionCreators.closeMessage(narrativeId);
        Redux.handleAction(action);
}

export = EditPanelContainer;
