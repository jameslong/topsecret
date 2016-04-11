import Config = require('./config');
import Immutable = require('immutable');
import Edge = require('./edge');
import Narrative = require('./narrative');

interface UIInt {
        activeNarrativeId: string;
        activeMessageId: string;
        nameScratchpad: Narrative.Strings;
};
export type UI = Immutable.Record.IRecord<UIInt>;
export const UI = Immutable.Record<UIInt>({
        activeNarrativeId: '',
        activeMessageId: '',
        nameScratchpad: Immutable.Map<string, string>(),
}, 'UI');

interface DataInt {
        narrativesById: Narrative.Narratives;
        edges: Edge.Edges;
};
export type Data = Immutable.Record.IRecord<DataInt>;
export const Data = Immutable.Record<DataInt>({
        narrativesById: Immutable.Map<string, Narrative.Narrative>(),
        edges: Immutable.List<Edge.Edge>(),
}, 'Data');

interface StoreInt {
        ui: UI;
        data: Data;
};
export type Store = Immutable.Record.IRecord<StoreInt>;
export const Store = Immutable.Record<StoreInt>({
        ui: UI(),
        data: Data(),
}, 'Store');

interface StateInt {
        config: Config.Config;
        past: Immutable.List<Store>;
        present: Store;
        future: Immutable.List<Store>;
        lastSaved: Store;
        dirty: boolean;
};
export type State = Immutable.Record.IRecord<StateInt>;
export const State = Immutable.Record<StateInt>({
        config: Config.Config(),
        past: Immutable.List<Store>(),
        present: Store(),
        future: Immutable.List<Store>(),
        lastSaved: null,
        dirty: false,
}, 'State');

export function getActiveStore (state: State)
{
        return state.present;
}
