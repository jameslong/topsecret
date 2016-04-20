import Edge = require('../../edge');
import MathUtils = require('../../math');
import React = require('react');

import Core = require('../core');
import G = Core.G;

interface ArrowClassProps extends React.Props<any> {
        edge: Edge.Edge;
}

function renderArrow (props: ArrowClassProps) {
        const edge = props.edge;
        const start = edge.line.start;
        const end = edge.line.end;

        const arrowhead = createArrowhead(start, end);

        const line = Core.Line({
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y,
                className: 'line',
        });

        const className = getClassName(edge.type);

        return G({ className: className }, line, arrowhead);
}

const Arrow = React.createFactory(renderArrow);

function createArrowhead (start: MathUtils.Coord, end: MathUtils.Coord)
{
        const width = 10;
        const height = 10;

        const points: MathUtils.Coord[] = [
                { x: 0, y: 0 },
                { x: width/2, y: 0 },
                { x: 0, y: height },,
                { x: -width/2, y: 0 },
        ];

        const pointString = points.reduce(
                (result, point) =>
                        `${result} ${point.x}, ${point.y}`,
                '');

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        const angleDegrees = angle * 180 / Math.PI;

        const position = {
                x: end.x - (Math.cos(angle) * height),
                y: end.y - (Math.sin(angle) * height),
        };
        const translation = `translate(${position.x},${position.y})`;
        const rotation = `rotate(${angleDegrees - 90})`;

        return Core.Polygon({
                points: pointString,
                transform: `${translation}, ${rotation}`,
                });
}

function getClassName (type: Edge.Type)
{
        switch (type) {
        case Edge.Type.Fallback:
                return 'arrow-fallback';
        case Edge.Type.Child:
                return 'arrow-child';
        case Edge.Type.ReplyOption:
                return 'arrow-reply-option';
        default:
                return '';
        }
}

export = Arrow;
