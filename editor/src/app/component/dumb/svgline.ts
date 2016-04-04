import MathUtils = require('../../math');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import Line = Core.Line;

type SvgLineClassProps = ReactUtils.Props<MathUtils.Line>;

function render (props: SvgLineClassProps)
{
        const data = props.data;
        const start = data.start;
        const end = data.end;

        return Line({
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y,
                className: 'line',
        });
}

export const SvgLine = ReactUtils.createFactory(render, 'SvgLine');
