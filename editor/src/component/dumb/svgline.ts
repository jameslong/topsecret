import MathUtils = require('../../math');
import React = require('react');

import Core = require('../core');
import Line = Core.Line;

interface SvgLineProps extends React.Props<any> {
        line: MathUtils.Line;
}

function renderSvgLine (props: SvgLineProps)
{
        const line = props.line;
        const start = line.start;
        const end = line.end;

        return Line({
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y,
                className: 'line',
        });
}

const SvgLine = React.createFactory(renderSvgLine);

export = SvgLine;
