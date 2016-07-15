import Actions = require('../../actions/actions');
import React = require('react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditArea = require('../dumb/editarea');

interface EditAreaContainerProps extends React.Props<any> {
        store: State.Store;
};

function renderEditAreaContainer (props: EditAreaContainerProps)
{
        const store = props.store;
        const narrativeId = store.ui.activeNarrativeId;
        const editAreaProps = {
                store,
                onClick: (e: MouseEvent) => onClick(narrativeId, e),
        };
        return EditArea(editAreaProps);
}

const EditAreaContainer = React.createFactory(renderEditAreaContainer);

function onClick (narrativeId: string, e: MouseEvent)
{
        e.stopPropagation();

        const action = Actions.deselectAllMessages(narrativeId);
        Redux.handleAction(action);
}

export = EditAreaContainer;
