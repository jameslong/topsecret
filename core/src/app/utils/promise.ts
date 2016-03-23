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

export function delay (delayMs: number)
{
        return new Promise((resolve, reject) =>
                setTimeout(resolve, delayMs));
}

export function loop<T> (delayMs: number, factory: Factory<void, T>): Promise<void>
{
        return factory(null).then(result =>
                delay(delayMs)
        ).then(result => loop(delayMs, factory));
}
