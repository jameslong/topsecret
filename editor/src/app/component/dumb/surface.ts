import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Div = Core.Div;
import Dragzone = require('../smart/dragzone');
import Immutable = require('immutable');

type SurfaceProps = ReactUtils.Props<string>;

function render (props: SurfaceProps)
{
        const narrativeId = props.data;
        const children = props.children;
        const dragzoneData = Dragzone.DragzoneData({
                className: 'surface-dragzone',
                narrativeId,
        });

        return Div({ className: 'surface' },
                Dragzone.Dragzone(dragzoneData, children));
}

export const Surface = ReactUtils.createFactory(render, 'Surface');
