import Immutable = require('immutable');
import Narrative = require('../../narrative');
import ReactUtils = require('../../redux/react');
import State = require('../../state');

import Core = require('../core');
import Div = Core.Div;
import EditMessageContainer = require('../smart/editmessagecontainer');

interface EditPanelInt {
        store: State.Store;
        onClick: (e: MouseEvent) => void;
};
export type EditPanelData = Immutable.Record.IRecord<EditPanelInt>;
export const EditPanelData = Immutable.Record<EditPanelInt>({
        store: State.Store(),
        onClick: () => {},
}, 'EditPanel');

type EditPanelProps = ReactUtils.Props<EditPanelData>;

function render (props: EditPanelProps)
{
        const data = props.data;
        const store = data.store;
        const narrative = Narrative.getActiveNarrative(store);

        const editMessageData = EditMessageContainer.EditMessageContainerData({
                name: store.activeMessage,
                store: store,
        });
        const editMessage = EditMessageContainer.EditMessageContainer(editMessageData);

        const panelProps = {
                className: 'edit-panel',
                onClick: data.onClick,
        };

        const contentProps = {
                className: 'edit-panel-content',
                onClick: onClick,
        };

        return Div(panelProps,
                Div(contentProps, editMessage)
        );
}

export const EditPanel = ReactUtils.createFactory(render, 'EditPanel');

function onClick (e: MouseEvent)
{
        e.stopPropagation();
}
