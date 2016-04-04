import Immutable = require('immutable');

export interface CoordInt {
        x: number;
        y: number;
};
export type Coord = Immutable.Record.IRecord<CoordInt>;
export const Coord = Immutable.Record<CoordInt>({
        x: 0, y: 0 }, 'Coord');

export function add (a: Coord, b: Coord)
{
        return Coord({
                x: a.x + b.y,
                y: a.y + b.y,
        });
}

interface RectInt extends CoordInt {
        width: number;
        height: number;
};
export type Rect = Immutable.Record.IRecord<RectInt>;
export const Rect = Immutable.Record<RectInt>({
        x: 0, y: 0, width: 0, height: 0 }, 'Rect');

interface LineInt {
        start: Coord;
        end: Coord;
};
export type Line = Immutable.Record.IRecord<LineInt>;
export const Line = Immutable.Record<LineInt>({
        start: Coord(),
        end: Coord(),
}, 'Line');

interface NodeInt {
        name: string;
        position: Coord;
        connections: Immutable.List<string>;
};
export type Node = Immutable.Record.IRecord<NodeInt>;
export const Node = Immutable.Record<NodeInt>({
        name: '',
        position: Coord(),
        connections: Immutable.List<string>(),
}, 'Node');

export function convertToImmutableCoord (coordMutable: Coord)
{
        return Coord({
                x: coordMutable.x,
                y: coordMutable.y,
        });
}
