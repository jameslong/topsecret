import Actions = require('../../actions/actions');
import React = require('react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import Content = require('./content');

interface ContentContainerProps extends React.Props<any> {
        store: State.Store;
};

function renderContentContainer (props: ContentContainerProps)
{
        const store = props.store;
        const narrativeId = store.ui.activeNarrativeId;
        const contentProps = {
                store,
                onClick: (e: MouseEvent) => onClick(narrativeId, e),
        };
        return Content(contentProps);
}

const ContentContainer = React.createFactory(renderContentContainer);

function onClick (narrativeId: string, e: MouseEvent)
{
        e.stopPropagation();

        const action = Actions.deselectAllMessages(narrativeId);
        Redux.handleAction(action);
}

export = ContentContainer;
