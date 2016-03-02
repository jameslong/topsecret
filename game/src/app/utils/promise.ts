/// <reference path="../global.d.ts"/>

export type Factory<T, U> = (data: T) => Promise<U>;

export function executeSequentially<T> (
        promiseFactories: Factory<T, T>[],
        value: T)
{
        let result = Promise.resolve<T>(value);
        promiseFactories.forEach(factory => {
                result = result.then(factory);
        });
        return result;
}
