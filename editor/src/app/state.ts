///<reference path='config.ts'/>
///<reference path='narrative.ts'/>
///<reference path='helpers.ts'/>
///<reference path='message.ts'/>
///<reference path='profile.ts'/>
///<reference path='replyoption.ts'/>

module Im {
        interface StoreInt {
                activeNarrative: string;
                activeMessage: string;
                narratives: Narratives;
                edges: Edges;
                nameScratchpad: Strings;
        };
        export type Store = Immutable.Record.IRecord<StoreInt>;
        export const Store = Immutable.Record<StoreInt>({
                activeNarrative: '',
                activeMessage: '',
                narratives: Immutable.Map<string, Narrative>(),
                edges: Immutable.List<Edge>(),
                nameScratchpad: Immutable.Map<string, string>(),
        }, 'Store');

        interface StateInt {
                config: Config;
                stores: Immutable.List<Store>;
                activeStoreIndex: number;
                lastSavedStore: Store;
                dirty: boolean;
        };
        export type State = Immutable.Record.IRecord<StateInt>;
        export const State = Immutable.Record<StateInt>({
                config: Config(),
                stores: Immutable.List<Store>(),
                activeStoreIndex: 0,
                lastSavedStore: null,
                dirty: false,
        }, 'State');

        export function getActiveStore (state: State)
        {
                return state.stores.get(state.activeStoreIndex);
        }
}
