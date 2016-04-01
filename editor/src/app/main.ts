/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../../typings/react/react-global.d.ts" />
///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
///<reference path='../../../typings/immutable/immutable-overrides.d.ts'/>
///<reference path='redux/redux.ts'/>
///<reference path='redux/react.ts'/>
///<reference path='action/actionhandlermap.ts'/>
///<reference path='./config.ts'/>
///<reference path='./misc.ts'/>
///<reference path='./state.ts'/>
///<reference path='./edge.ts'/>
///<reference path='./asyncrequest.ts'/>
///<reference path='component/dumb/root.ts'/>
///<reference path='./eventhandler.ts'/>

window.onload = () => {
        const wrapper = document.getElementById('wrapper');

        const config = Config.Config({
                serverURL: 'http://127.0.0.1:3000',
                autosaveDelayms: 3000,
                maxUndos: 30,
                gridSize: 11,
                vertexSize: MathUtils.Coord({ x: 66, y: 66 }),
        });

        const store = State.Store({
                activeNarrative: '',
                activeMessage: '',
                narratives: Immutable.Map<string, Narrative.Narrative>(),
                edges: Immutable.List<Edge.Edge>(),
                nameScratchpad: Immutable.Map<string, string>(),
        });

        const state = State.State({
                config: config,
                stores: Immutable.List.of<State.Store>(store),
                activeStoreIndex: 0,
                lastSavedStore: store,
                dirty: false,
        });

        Redux.init(state, ActionHandlerMap.handleNewAction, Component.Root, wrapper);

        AsyncRequest.requestNarratives(config.serverURL);
        EventHandler.addKeyHandlers();
};
