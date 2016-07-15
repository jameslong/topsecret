import EditorMessage = require('../../editormessage');
import Narrative = require('../../narrative');
import React = require('react');
import State = require('../../state');

import Core = require('../core');
import Div = Core.Div;
import EditAreaContainer = require('../smart/editareacontainer');
import EditPanelContainer = require('../smart/editpanelcontainer');
import MenuBarContainer = require('../../editor/toolbar/toolbarcontainer');

interface RootProps extends React.Props<any> {
        state: State.State;
}

function renderRoot (props: RootProps)
{
        const state = props.state;
        const store = State.getActiveStore(state);
        const narrativeNames = Object.keys(store.data.narrativesById);

        const activeNarrativeId = store.ui.activeNarrativeId;
        const activeMessage = store.ui.activeMessageId;

        const message = activeMessage ? EditPanelContainer({ store }) : null;

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

        return Div({ className: 'root' },
                EditAreaContainer({ store }),
                MenuBarContainer(menuBarProps),
                message
        );
}

const Root = React.createFactory(renderRoot);

export = Root;
