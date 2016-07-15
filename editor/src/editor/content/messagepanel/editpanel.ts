import Narrative = require('../../../narrative');
import React = require('react');
import State = require('../../../state');

import Core = require('../../../component/core');
import Div = Core.Div;
import EditMessageContainer = require('./editmessagecontainer');

interface EditPanelProps {
        store: State.Store;
        onClick: (e: MouseEvent) => void;
};

function renderEditPanel (props: EditPanelProps)
{
        const store = props.store;
        const narrativeId = store.ui.activeNarrativeId;
        const narrative = Narrative.getActiveNarrative(store);

        const editMessageProps = {
                name: store.ui.activeMessageId,
                narrativeId,
                store: store,
        };
        const editMessage = EditMessageContainer(editMessageProps);

        const panelProps = {
                className: 'edit-panel',
                onClick: props.onClick,
        };

        const contentProps = {
                className: 'edit-panel-content',
                onClick: onClick,
        };

        return Div(panelProps,
                Div(contentProps, editMessage)
        );
}

const EditPanel = React.createFactory(renderEditPanel);

function onClick (e: MouseEvent)
{
        e.stopPropagation();
}

export = EditPanel;
