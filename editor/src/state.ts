import Edge = require('./edge');
import MathUtils = require('./math');
import Narrative = require('./narrative');

export interface Config {
        serverURL: string;
        autosaveDelayms: number;
        maxUndos: number;
        gridSize: number;
        vertexSize: MathUtils.Coord;
}

export interface UI {
        activeNarrativeId: string;
        activeMessageId: string;
};

export interface Data {
        narrativesById: Narrative.Narratives;
        edges: Edge.Edges;
        nameScratchpad: Narrative.Strings;
};

export interface Store {
        ui: UI;
        data: Data;
};

export interface State {
        config: Config;
        past: Store[];
        present: Store;
        future: Store[];
        lastSaved: Store;
        dirty: boolean;
};

export function getActiveStore (state: State)
{
        return state.present;
}
