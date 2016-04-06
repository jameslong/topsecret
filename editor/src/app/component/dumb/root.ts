import Helpers = require('../../helpers');
import Message = require('../../message');
import Narrative = require('../../narrative');
import ReactUtils = require('../../redux/react');
import State = require('../../state');

import Core = require('../core');
import Div = Core.Div;
import EditAreaContainer = require('../smart/editareacontainer');
import EditPanelContainer = require('../smart/editpanelcontainer');
import MenuBarContainer = require('../smart/menubarcontainer');

type RootProps = ReactUtils.Props<State.State>;

function render (props: RootProps)
{
        const state = props.data;
        const store = State.getActiveStore(state);
        const narrativeNames = Helpers.keys(store.narrativesById);

        const activeNarrativeId = store.activeNarrativeId;
        const activeMessage = store.activeMessageId;

        const message = activeMessage ?
                EditPanelContainer.EditPanelContainer(store) : null;

        if (activeMessage) {
                window.document.body.classList.add('open-modal');
        } else {
                window.document.body.classList.remove('open-modal');
        }

        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const singleSelected = Message.getSingleSelectedMessage(messages);

        const menuBarData = MenuBarContainer.MenuBarContainerData({
                narrativeNames,
                activeNarrativeId,
                activeMessageId: singleSelected,
        });

        return Div({ className: 'root' },
                EditAreaContainer.EditAreaContainer(store),
                MenuBarContainer.MenuBarContainer(menuBarData),
                message
        );
}

export const Root = ReactUtils.createFactory(render, 'Root');
