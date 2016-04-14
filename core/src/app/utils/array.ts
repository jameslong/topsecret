import MathUtil = require('./math');

export interface Iteratee<T, U> {
        (value: T, index: number, array: T[]): U;
}

export interface Predicate<T> {
        (value: T, index: number, array: T[]): boolean;
}

export function createArray<T> (length: number, defaultValue: T)
{
        const result: T[] = [];
        for (let index = 0; index < length; index += 1) {
                result.push(defaultValue);
        }
        return result;
}

export function push<T>(array: T[], value: T)
{
        return array.concat([value]);
}

export function remove<T>(array: T[], value: T)
{
        return array.filter(element => element !== value);
}

export function every<T> (list: T[], predicate: Predicate<T>)
{
        return (list.filter(predicate)).length === list.length;
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

export function flatten<T> (list: T[][]): T[]
{
        return [].concat.apply([], list);
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

export function partition<T> (list: T[], predicate: Predicate<T>): T[][]
{
        var pass: T[] = [];
        var fail: T[] = [];

        list.forEach(function (value, index, list)
        {
                (predicate(value, index, list) ? pass : fail).push(value);
        });

        return [pass, fail];
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

export function some<T> (list: T[], predicate: Predicate<T>)
{
        return find(list, predicate) !== -1;
}

export function valueOf<T> (list: T[], predicate: Predicate<T>): T
{
        var length = list.length;

        for (var index = 0; index < length; index += 1) {
                var value = list[index];
                if (predicate(value, index, list)) {
                        return value;
                }
        }

        return null;
}

export function zip<T, U>(left: T[], right: U[])
{
        return left.map((value, index) => <[T, U]>[value, right[index]]);
}

export function last<T>(list: T[])
{
        return list.length ? list[list.length - 1] : null;
}
