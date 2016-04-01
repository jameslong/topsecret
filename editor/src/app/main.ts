/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../../typings/react/react-global.d.ts" />
///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
///<reference path='../../../typings/immutable/immutable-overrides.d.ts'/>
///<reference path='action/actionhandlermap.ts'/>
///<reference path='flux/flux.ts'/>
///<reference path='flux/react.ts'/>
///<reference path='./config.ts'/>
///<reference path='./misc.ts'/>
///<reference path='./state.ts'/>
///<reference path='./edge.ts'/>
///<reference path='./asyncrequest.ts'/>
///<reference path='component/dumb/root.ts'/>
///<reference path='./eventhandler.ts'/>

window.onload = () => {
        const wrapper = document.getElementById('wrapper');

        const config = Im.Config({
                serverURL: 'http://127.0.0.1:3000',
                autosaveDelayms: 3000,
                maxUndos: 30,
                gridSize: 11,
                vertexSize: Im.Coord({ x: 66, y: 66 }),
        });

        const store = Im.Store({
                activeNarrative: '',
                activeMessage: '',
                narratives: Immutable.Map<string, Im.Narrative>(),
                edges: Immutable.List<Im.Edge>(),
                nameScratchpad: Immutable.Map<string, string>(),
        });

        const state = Im.State({
                config: config,
                stores: Immutable.List.of<Im.Store>(store),
                activeStoreIndex: 0,
                lastSavedStore: store,
                dirty: false,
        });

        Flux.init(state, ActionHandlerMap.handleNewAction, Component.Root, wrapper);

        AsyncRequest.requestNarratives(config.serverURL);
        EventHandler.addKeyHandlers();
};
