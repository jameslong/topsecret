import MathUtils = require('../../math');
import React = require('react');

import Core = require('./core');
import Div = Core.Div;

interface AbsoluteProps extends React.Props<any> {
        coord: MathUtils.Coord;
}

function renderAbsolute (props: AbsoluteProps)
{
        const children = props.children;
        const style = {
                position: 'absolute',
                left: props.coord.x,
                top: props.coord.y,
        };
        return Div({ style: style }, children);
}

const Absolute = React.createFactory(renderAbsolute);

export = Absolute;
