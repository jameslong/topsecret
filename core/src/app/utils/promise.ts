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

export function find<T> (factories: (() => Promise<boolean>)[])
{
        let result = Promise.resolve<number>(-1);
        factories.forEach((factory, currentIndex) => {
                result = result.then(index => index === -1 ?
                        factory().then(passed => passed ? currentIndex : -1) :
                        index);
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
