/// <reference path="svgline.ts" />

module Component {
        type ArrowClassProps = Redux.Props<Im.Edge>;

        function render (props: ArrowClassProps) {
                const data = props.data;
                const start = data.line.start;
                const end = data.line.end;

                const arrowhead = createArrowhead(start, end);

                const line = Line({
                        x1: start.x,
                        y1: start.y,
                        x2: end.x,
                        y2: end.y,
                        className: 'line',
                });

                const className = getClassName(data.type);

                return G({ className: className }, line, arrowhead);
        }

        export const Arrow = Redux.createFactory(render, 'Arrow');

        function createArrowhead (start: Im.Coord, end: Im.Coord)
        {
                const width = 10;
                const height = 10;

                const points = Immutable.List.of<Im.Coord>(
                        Im.Coord({ x: 0, y: 0 }),
                        Im.Coord({ x: width/2, y: 0 }),
                        Im.Coord({ x: 0, y: height }),
                        Im.Coord({ x: -width/2, y: 0 })
                );

                const pointString = points.reduce(
                        (result, point) =>
                                `${result} ${point.x}, ${point.y}`,
                        '');

                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const angle = Math.atan2(dy, dx);
                const angleDegrees = angle * 180 / Math.PI;

                const position = Im.Coord({
                        x: end.x - (Math.cos(angle) * height),
                        y: end.y - (Math.sin(angle) * height),
                });
                const translation =
                        `translate(${position.x},${position.y})`;
                const rotation = `rotate(${angleDegrees - 90})`;

                return Polygon({
                        points: pointString,
                        transform: `${translation}, ${rotation}`,
                        });
        }

        function getClassName (type: Im.Type)
        {
                switch (type) {
                case Im.Type.Fallback:
                        return 'arrow-fallback';
                case Im.Type.Child:
                        return 'arrow-child';
                case Im.Type.ReplyOption:
                        return 'arrow-reply-option';
                default:
                        return '';
                }
        }
}
