import Helpers = require('../utils/helpers');

export interface Map<T> {
        [i: string]: T;
}

export interface Iteratee<T, U> {
        (value: T, key: string, map: Map<T>): U;
}

interface Reducer<T, U> {
        (result: U, value: T, key: string, map: Map<T>): U;
}

interface Predicate<T> {
        (value: T, key: string, map: Map<T>): boolean;
}

export function create<T>(pairs: [string, T][]): Map<T>
{
        let result: Map<T> = {};
        pairs.forEach(pair => result[pair[0]] = pair[1]);
        return result;
}

export function set<T>(map: Map<T>, key: string, value: T)
{
        return Helpers.assign(map, { [key]: value });
}

export function remove<T>(map: Map<T>, key: string)
{
        const copy = Helpers.assign({}, map);
        delete copy[key];
        return copy;
}

export function keys<T>(map: Map<T>)
{
        return Object.keys(map);
}

export function merge<T, U>(mapA: Map<T>, mapB: Map<T>)
{
        return Helpers.assign(mapA, mapB);
}

export function map<T, U>(map: Map<T>, iteratee: Iteratee<T, U>)
{
        let result: Map<U> = {};
        for (let key in map) {
                if (map.hasOwnProperty(key)) {
                        result[key] = iteratee(map[key], key, map);
                }
        }
        return result;
}

export function filter<T>(map: Map<T>, predicate: Predicate<T>)
{
        let result: Map<T> = {};
        for (let key in map) {
                if (map.hasOwnProperty(key)) {
                        if(predicate(map[key], key, map)) {
                                result[key] = map[key];
                        }
                }
        }
        return result;
}

export function reduce<T, U>(
        map: Map<T>, reducer: Reducer<T, U>, result: U)
{
        for (let key in map) {
                if (map.hasOwnProperty(key)) {
                        result = reducer(result, map[key], key, map);
                }
        }
        return result;
}

export function find<T>(map: Map<T>, predicate: Predicate<T>)
{
        for (let key in map) {
                if (map.hasOwnProperty(key)) {
                        if(predicate(map[key], key, map)) {
                                return map[key];
                        }
                }
        }
        return undefined;
}
