import EditorMessage = require('../editormessage');
import Narrative = require('../narrative');
import React = require('react');
import State = require('../state');

import Core = require('./common/core');
import Div = Core.Div;
import ContentContainer = require('./content/contentcontainer');
import MessagePanelContainer = require('./content/messagepanel/messagepanelcontainer');
import ToolbarContainer = require('./toolbar/toolbarcontainer');

interface EditorProps extends React.Props<any> {
        state: State.State;
}

function renderEditor (props: EditorProps)
{
        const state = props.state;
        const store = State.getActiveStore(state);
        const narrativeNames = Object.keys(store.data.narrativesById);

        const activeNarrativeId = store.ui.activeNarrativeId;
        const activeMessage = store.ui.activeMessageId;

        const message = activeMessage ? MessagePanelContainer({ store }) : null;

        if (activeMessage) {
                window.document.body.classList.add('open-modal');
        } else {
                window.document.body.classList.remove('open-modal');
        }

        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const singleSelected = EditorMessage.getSingleSelectedMessage(messages);

        const menuBarProps = {
                narrativeNames,
                activeNarrativeId,
                activeMessageId: singleSelected,
                saving: state.dirty,
        };

        return Div({ className: 'editor' },
                ContentContainer({ store }),
                ToolbarContainer(menuBarProps),
                message
        );
}

const Editor = React.createFactory(renderEditor);

export = Editor;
