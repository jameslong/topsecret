import React = require('react');

import Core = require('../../editor/common/core');
import Div = Core.Div;
import Dragzone = require('../smart/dragzone');

interface SurfaceProps extends React.Props<any> {
        narrativeId: string;
}

function renderSurface (props: SurfaceProps)
{
        const narrativeId = props.narrativeId;
        const children = props.children;
        const dragzoneProps = {
                className: 'surface-dragzone',
                narrativeId,
        };

        return Div({ className: 'surface' }, Dragzone(dragzoneProps, children));
}

const Surface = React.createFactory(renderSurface);

export = Surface;
