/// <reference path="../../../../typings/react/react.d.ts"/>
/// <reference path="../../../../typings/react/react-dom.d.ts"/>
import React = require('react');
import ReactDOM = require('react-dom');

export interface Action<T> {
        type: string;
        parameters: T;
}

export interface Props {
        key?: string | number;
}

export let handleAction: <T>(action: Action<T>) => void = null;

export function init<T, U>(
        state: T,
        reducer: (state: T, action: Action<U>) => T,
        rootComponent: React.Factory<{ state: T }>,
        wrapper: HTMLElement)
{
        let appState = { state: state };

        handleAction = (action: Action<U>) => {
                appState.state = reducer(appState.state, action);
                render(appState.state, rootComponent, wrapper);
        };
}

export function render <T>(
        state: T,
        rootComponent: React.Factory<{ state: T }>,
        wrapper: HTMLElement)
{
        const root = rootComponent({ state });
        ReactDOM.render(root, wrapper);
}
