import Func = require('../../../../core/src/utils/function');
import Helpers = require('../../../../core/src/utils/helpers');
import Narrative = require('../../narrative');
import React = require('react');
import State = require('../../state');

import Core = require('../core');
import Div = Core.Div;
import Edge = require('../../editor/content/edge/edge');
import NodeContainer = require('../../editor/content/node/nodecontainer');
import Surface = require('./surface');
import SurfaceSVG = require('./surfacesvg');

interface EditAreaProps extends React.Props<any> {
        store: State.Store;
        onClick: (e: MouseEvent) => void,
};

function renderEditArea (props: EditAreaProps)
{
        const store = props.store;
        const narrativeId = store.ui.activeNarrativeId;
        const narrative = Narrative.getActiveNarrative(store);
        const messages = narrative.messagesById;
        const messageList = Helpers.arrayFromMap(messages, Func.identity);

        const messageComponents = messageList.map(
                message => NodeContainer({
                        key: message.name,
                        message,
                        narrativeId,
                })
        );

        const edges = store.data.edges;
        const connections = edges.map(
                edge => Edge({
                        key: edge.name,
                        edge,
                })
        );

        const editProps = {
                className: 'edit-area',
                onClick: props.onClick,
        };

        const surfaceProps = { narrativeId };

        return Div(editProps,
                SurfaceSVG(null, connections),
                Surface(surfaceProps, messageComponents)
        );
}

const EditArea = React.createFactory(renderEditArea);

export = EditArea;
