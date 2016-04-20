export interface Coord {
        x: number;
        y: number;
};

export function add (a: Coord, b: Coord): Coord
{
        return {
                x: a.x + b.y,
                y: a.y + b.y,
        };
}

export interface Rect extends Coord {
        width: number;
        height: number;
};

export interface Line {
        start: Coord;
        end: Coord;
};

export interface Node {
        name: string;
        position: Coord;
        connections: string[];
};
