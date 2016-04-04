import MathUtils = require('../../math');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Div = Core.Div;

type AbsoluteProps = ReactUtils.Props<MathUtils.Coord>;

function render (props: AbsoluteProps)
{
        const data = props.data;
        const children = props.children;
        const style = {
                position: 'absolute',
                left: data.x,
                top: data.y,
        };
        return Div({ style: style }, children);
}

export const Absolute = ReactUtils.createFactory(render, 'Absolute');
