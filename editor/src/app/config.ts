import MathUtils = require('./math');

export interface Config {
        serverURL: string;
        autosaveDelayms: number;
        maxUndos: number;
        gridSize: number;
        vertexSize: MathUtils.Coord;
}
