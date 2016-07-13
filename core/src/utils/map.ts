import Helpers = require('./helpers');

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

export function every<T> (
        object: Map<T>, predicate: (value: T, key: string)=>boolean): boolean
{
        return (Object.keys(filter(object, predicate)).length ===
                Object.keys(object).length);
}

export function exists<T> (object: Map<T>, key: string): boolean
{
        return (object[key] !== undefined);
}

export function extractN<T> (
        object: Map<T>, startKey: string, maxResults: number)
        : { items: T[], lastEvaluatedKey: string }
{
        const keys = Object.keys(object);
        const length = keys.length;

        let items: T[] = [];
        let lastEvaluatedKey: string = null;

        if (length > 0) {
                const startKeyIndex = keys.indexOf(startKey);
                const startIndex = ((startKeyIndex === -1) ? 0 : startKeyIndex);
                const section = keys.slice(startIndex, startIndex + maxResults);
                items = section.map((key) => object[key]);

                lastEvaluatedKey = section[section.length - 1];
        }

        return {
                lastEvaluatedKey,
                items,
        };
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

export function forEach<T> (
        object: Map<T>, iteratee: (value: T, key: string)=>any)
{
        for (let key in object) {
                if (object.hasOwnProperty(key)) {
                        iteratee(object[key], key);
                }
        }
}

export function keys<T>(map: Map<T>)
{
        return Object.keys(map);
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

export function merge<T, U>(mapA: Map<T>, mapB: Map<T>)
{
        return Helpers.assign(mapA, mapB);
}

export function mergeMaps<T> (maps: Map<T>[]): Map<T>
{
        let result: Map<T> = {};
        maps.forEach(map => {
                for (let key in map) {
                        if (map.hasOwnProperty(key)) {
                                result[key] = map[key];
                        }
                }
        });

        return result;
}

export function pick<T> (map: Map<T>, keys: string[]): Map<T>
{
        let result: Map<T> = {};
        keys.forEach(key => {
                result[key] = map[key];
        });

        return result;
}

export function omit<T> (map: Map<T>, keys: string[]): Map<T>
{
        const omittedKeys = create(
                keys.map(key => <[string, boolean]>[key, true]));
        const hasKey = (value: T, key: string) => !omittedKeys[key];
        return filter<T>(map, hasKey);
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

export function valueOf<T> (
        object: Map<T>, predicate: (value: T, key: string)=>boolean): T
{
        for (let key in object) {
                if (object.hasOwnProperty(key) && predicate(object[key], key)) {
                        return object[key];
                }
        }

        return null;
}
