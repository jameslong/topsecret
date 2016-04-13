import Immutable = require('immutable');
import Narrative = require('../../narrative');
import ReactUtils = require('../../redux/react');
import State = require('../../state');

import Core = require('../core');
import Div = Core.Div;
import Arrow = require('./arrow');
import NodeContainer = require('../smart/nodecontainer');
import Surface = require('./surface');
import SurfaceSVG = require('./surfacesvg');

interface EditAreaInt {
        store: State.Store;
        onClick: (e: MouseEvent) => void,
};
export type EditAreaData = Immutable.Record.IRecord<EditAreaInt>;
export const EditAreaData = Immutable.Record<EditAreaInt>({
        store: State.Store(),
        onClick: () => {},
}, 'EditArea');

type EditAreaProps = ReactUtils.Props<EditAreaData>;

function render (props: EditAreaProps)
{
        const data = props.data;
        const store = data.store;
        const narrativeId = store.ui.activeNarrativeId;
        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const messageList = messages.toList();

        const messageComponents = messageList.map(
                message => NodeContainer.NodeContainer({
                        key: message.name,
                        data: NodeContainer.NodeContainerData({
                                message, narrativeId })
                })
        );

        const edges = store.data.edges;
        const connections = edges.map(
                edge => Arrow.Arrow({
                        key: edge.name,
                        data: edge,
                })
        );

        const editProps = {
                className: 'edit-area',
                onClick: data.onClick,
        };

        const surfaceProps = { narrativeId };

        return Div(editProps,
                SurfaceSVG.SurfaceSVG(null, connections),
                Surface.Surface(narrativeId, messageComponents)
        );
}

export const EditArea = ReactUtils.createFactory(render, 'EditArea');
