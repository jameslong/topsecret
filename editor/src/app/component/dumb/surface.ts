import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Div = Core.Div;
import Dragzone = require('../smart/dragzone');

type SurfaceProps = ReactUtils.Props<void>;

function render (props: SurfaceProps)
{
        const data = props.data;
        const children = props.children;

        return Div({ className: 'surface' },
                Dragzone.Dragzone('surface-dragzone', children));
}

export const Surface = ReactUtils.createFactory(render, 'Surface');
