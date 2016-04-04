import Config = require('./config');
import Immutable = require('immutable');
import Edge = require('./edge');
import Narrative = require('./narrative');

interface StoreInt {
        activeNarrative: string;
        activeMessage: string;
        narratives: Narrative.Narratives;
        edges: Edge.Edges;
        nameScratchpad: Narrative.Strings;
};
export type Store = Immutable.Record.IRecord<StoreInt>;
export const Store = Immutable.Record<StoreInt>({
        activeNarrative: '',
        activeMessage: '',
        narratives: Immutable.Map<string, Narrative.Narrative>(),
        edges: Immutable.List<Edge.Edge>(),
        nameScratchpad: Immutable.Map<string, string>(),
}, 'Store');

interface StateInt {
        config: Config.Config;
        stores: Immutable.List<Store>;
        activeStoreIndex: number;
        lastSavedStore: Store;
        dirty: boolean;
};
export type State = Immutable.Record.IRecord<StateInt>;
export const State = Immutable.Record<StateInt>({
        config: Config.Config(),
        stores: Immutable.List<Store>(),
        activeStoreIndex: 0,
        lastSavedStore: null,
        dirty: false,
}, 'State');

export function getActiveStore (state: State)
{
        return state.stores.get(state.activeStoreIndex);
}
