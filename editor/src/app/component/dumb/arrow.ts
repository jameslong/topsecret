import Edge = require('../../edge');
import Immutable = require('immutable');
import MathUtils = require('../../math');
import ReactUtils = require('../../redux/react');

import Core = require('../core');
import G = Core.G;

type ArrowClassProps = ReactUtils.Props<Edge.Edge>;

function render (props: ArrowClassProps) {
        const data = props.data;
        const start = data.line.start;
        const end = data.line.end;

        const arrowhead = createArrowhead(start, end);

        const line = Core.Line({
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y,
                className: 'line',
        });

        const className = getClassName(data.type);

        return G({ className: className }, line, arrowhead);
}

export const Arrow = ReactUtils.createFactory(render, 'Arrow');

function createArrowhead (start: MathUtils.Coord, end: MathUtils.Coord)
{
        const width = 10;
        const height = 10;

        const points = Immutable.List.of<MathUtils.Coord>(
                MathUtils.Coord({ x: 0, y: 0 }),
                MathUtils.Coord({ x: width/2, y: 0 }),
                MathUtils.Coord({ x: 0, y: height }),
                MathUtils.Coord({ x: -width/2, y: 0 })
        );

        const pointString = points.reduce(
                (result, point) =>
                        `${result} ${point.x}, ${point.y}`,
                '');

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        const angleDegrees = angle * 180 / Math.PI;

        const position = MathUtils.Coord({
                x: end.x - (Math.cos(angle) * height),
                y: end.y - (Math.sin(angle) * height),
        });
        const translation =
                `translate(${position.x},${position.y})`;
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
