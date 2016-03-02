/// <reference path="../../../typings/react/react.d.ts" />

module Flux {
        /* React can't handle immutable props so we need to wrap them in a
        mutable object. Immutable props allows quick shouldComponentUpdate */

        interface ReactProps {
                children?: React.ReactNode;
                key?: string | number;
        }

        export interface Props<T> extends ReactProps {
                data: T;
        }

        type Child = React.ReactNode;

        export interface Factory<P> {
                (data: P, ...children: Child[]): React.ReactElement<Props<P>>;
                (data: Props<P>, ...children: Child[]): React.ReactElement<Props<P>>;
        }

        function wrapFactory<P> (factory: React.Factory<Props<P>>): Factory<P>
        {
                function newFactory (data: any, ...children: Child[]): React.ReactElement<Props<P>>
                {
                        let props = <Props<P>><any>data;
                        props = (props && props.data) ?
                                props :
                                { data: <P><any>props };
                        return factory(props, ...children);
                }

                return <Factory<P>>newFactory;
        }

        export function createFactory<P> (
                renderFn: (props: Props<P>) => React.ReactElement<any>,
                displayName: string)
        {
                class NewClass extends React.Component<Props<P>, {}> {
                        static displayName = displayName;
                        shouldComponentUpdate (newProps: Props<P>)
                        {
                                return (this.props.data !== newProps.data) ||
                                        (this.props.children !== newProps.children);
                        }
                }
                NewClass.prototype.render = function () {
                        return renderFn(this.props);
                };

                const factory = <React.Factory<Props<P>>>React.createFactory(NewClass);
                return wrapFactory(factory);
        }

        interface ClassNameObject {
                [i: string]: boolean;
        }
        type ClassNameProperty = ClassNameObject | string;

        export function classNames (...props: ClassNameProperty[])
        {
                return props.reduce((result: string, value: ClassNameProperty) => {
                        if (typeof value === 'string') {
                                return `${result} ${value}`;
                        } else {
                                return objectClassNames(value, result);
                        }
                });
        }

        function objectClassNames (props: ClassNameObject, result: string)
        {
                const keys: string[] = Object.keys(props);
                return keys.reduce((result, key, index, keys) => {
                        const value = props[key];
                        return value ? `${result} ${key}` : result;
                }, result);
        }
}
