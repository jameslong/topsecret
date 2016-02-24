import MathUtil = require('./math');

export interface Iteratee<T, U> {
        (value: T, index: number, array: T[]): U;
}

export interface Predicate<T> {
        (value: T, index: number, array: T[]): boolean;
}

export function push<T>(array: T[], value: T)
{
        return array.concat([value]);
}

export function remove<T>(array: T[], value: T)
{
        return array.filter(element => element !== value);
}

export function find<T>(array: T[], predicate: Predicate<T>)
{
        const length = array.length;
        for (let i = 0; i < length; i += 1) {
                if (predicate(array[i], i, array)) {
                        return i;
                }
        }

        return -1;
}

export function nextValue<T>(array: T[], value: T)
{
        const index = array.indexOf(value);
        if (index !== -1) {
                const nextIndex = MathUtil.inRange(
                        0, array.length - 1, index + 1);
                return array[nextIndex];
        } else {
                return null;
        }
}

export function previousValue<T>(array: T[], value: T)
{
        const index = array.indexOf(value);
        if (index !== -1) {
                const nextIndex = MathUtil.inRange(
                        0, array.length - 1, index - 1);
                return array[nextIndex];
        } else {
                return null;
        }
}

export function zip<T, U>(left: T[], right: U[])
{
        return left.map((value, index) => <[T, U]>[value, right[index]]);
}
