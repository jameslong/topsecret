import Arr = require('./array');
import Map = require('../map/map');
import MathUtil = require('./math');

export function identity<T>(value: T) { return value; }

export function arrayFromMap<T, U>(
        map: Map.Map<T>, iteratee: Map.Iteratee<T, U>)
{
        const result: U[] = [];
        for (let key in map) {
                if (map.hasOwnProperty) {
                        result.push(iteratee(map[key], key, map));
                }
        }
        return result;
}

export function mapFromArray<T, U>(
        array: T[],
        getKey: (value: T) => string,
        getValue: Arr.Iteratee<T, U> = identity): Map.Map<U>
{
        const result: Map.Map<U> = {};
        return array.reduce((result, value, index, array) => {
                const key = getKey(value);
                const returnValue = getValue(value, index, array);
                result[key] = returnValue;
                return result;
        }, result);
}

export function mapFromParentArray<T, U>(
        array: T[],
        getChildren: ((value: T) => U[]),
        getChildKey: (value: U) => string): Map.Map<U>
{
        const result: Map.Map<U> = {};
        return array.reduce((result, value) => {
                const children = getChildren(value);
                const childMap = mapFromArray(
                        children, getChildKey, identity);
                return Object.assign(result, childMap);
        }, result);
}

export function next<U>(list: U[], index: number): U
{
        const length = list.length;

        if (length) {
                const nextIndex = MathUtil.inRange(
                        0, length - 1, index + 1);
                return list[nextIndex];
        } else {
                return null;
        }
}

export function previous<U>(list: U[], index: number): U
{
        const length = list.length;

        if (length) {
                const previousIndex = MathUtil.inRange(
                        0, length - 1, index - 1);
                return list[previousIndex];
        } else {
                return null;
        }
}

export function assign<T extends U, U>(source: T, ...subset: U[]): T
{
        return Object.assign({}, source, ...subset);
}

interface Predicate<T> {
        (value: T, index: number, array: T[]): boolean;
}

export function findIndex<T>(array: T[], predicate: Predicate<T>)
{
        const length = array.length;
        for (let i = 0; i < length; i += 1)
        {
                const value = array[i];
                if (predicate(value, i, array)) {
                        return i;
                }
        }
        return -1;
}

export function find<T>(array: T[], predicate: Predicate<T>)
{
        const length = array.length;
        for (let i = 0; i < length; i += 1)
        {
                const value = array[i];
                if (predicate(value, i, array)) {
                        return value;
                }
        }
        return null;
}
