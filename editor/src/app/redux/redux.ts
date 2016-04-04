/// <reference path="../../../../typings/react/react-dom.d.ts"/>

module Redux {
        export interface Action<T> {
                type: string;
                parameters: T;
        }

        export let handleAction: <T>(action: Action<T>) => void = null;

        export function init<T, U>(
                state: T,
                reducer: (state: T, action: Action<U>) => T,
                rootComponent: Factory<T>,
                wrapper: HTMLElement)
        {
                let appState = { state: state };

                Redux.handleAction = (action: Action<U>) => {
                        appState.state = reducer(appState.state, action);
                        render(appState.state, rootComponent, wrapper);
                };
        }

        function render <T>(
                state: T,
                rootComponent: Factory<T>,
                wrapper: HTMLElement)
        {
                const root = rootComponent(state);
                ReactDOM.render(root, wrapper);
        }
}
