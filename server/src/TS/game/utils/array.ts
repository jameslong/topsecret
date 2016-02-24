import Map = require('./map');

interface Predicate<T> {
    (list: T): boolean;
}

export function createArray<T> (length: number, defaultValue: T): T[]
{
        var result: T[] = [];

        for (var index = 0; index < length; index += 1) {
                result.push(defaultValue);
        }

        return result;
}

export function flatten<T> (list: T[][]): T[]
{
        return [].concat.apply([], list);
}

export function find<T> (list: T[], predicate: Predicate<T>): number
{
        var length = list.length;

        for (var index = 0; index < length; index += 1) {
                if (predicate(list[index])) {
                        return index;
                }
        }

    return -1;
}

export function arrayValueOf<T> (list: T[], predicate: Predicate<T>): T
{
        var length = list.length;

        for (var index = 0; index < length; index += 1) {
                var value = list[index];
                if (predicate(value)) {
                        return value;
                }
        }

        return null;
}

export function arrayEvery<T> (list: T[], predicate: Predicate<T>): boolean
{
        return ((list.filter(predicate)).length === list.length);
}

export function some<T> (list: T[], predicate: Predicate<T>): boolean
{
        return (find(list, predicate) !== -1);
}

export function partition<T> (list: T[], predicate: Predicate<T>): T[][]
{
        var pass: T[] = [];
        var fail: T[] = [];

        list.forEach(function (value, index)
        {
                (predicate(value) ? pass : fail).push(value);
        });

        return [pass, fail];
}

export function mapTruthy<T, U> (
        list: T[], iteratee: (value: T, index: number) => U): U[]
{
        return list.reduce((result, value, index) => {
                        var mapped = iteratee(value, index);
                        if (mapped) {
                                result.push(mapped);
                        }
                        return result;
                }, []);
}

export function mapFlatten<T, U> (
        list: T[], iteratee: (value: T, index: number) => U[]): U[]
{
        var nested = list.map(iteratee);
        return flatten(nested);
}

export function arrayToMap<T, U> (
        keys: string[],
        values: T[],
        iteratee: (value: T, index: number) => U)
        : Map.Map<U>
{
        let result: Map.Map<U> = {};

        return values.reduce((result, value, index) => {
                const key = keys[index];
                const mappedValue = iteratee(value, index);
                result[key] = mappedValue;
                return result;
        }, result);
}
