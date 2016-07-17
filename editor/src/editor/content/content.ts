import Func = require('../../../../core/src/utils/function');
import Helpers = require('../../../../core/src/utils/helpers');
import Narrative = require('../../narrative');
import React = require('react');
import State = require('../../state');

import Core = require('../common/core');
import Div = Core.Div;
import SVG = Core.SVG;
import Dragzone = require('./dragzone');
import Edge = require('./edge/edge');
import NodeContainer = require('./node/nodecontainer');

interface ContentProps extends React.Props<any> {
        store: State.Store;
        onClick: (e: MouseEvent) => void,
};

function renderContent (props: ContentProps)
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

        const surfaceSVG = SVG({ className: 'surface-svg' }, connections);
        const dragzoneProps = {
                className: 'surface-dragzone',
                narrativeId,
        };
        const surface = Div({ className: 'surface' },
                Dragzone(dragzoneProps, messageComponents));

        return Div(editProps, surfaceSVG, surface);
}

const Content = React.createFactory(renderContent);

export = Content;
