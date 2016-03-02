import Arr = require('./array');
import Func = require('./function');
import Map = require('./map');

export function assign<T extends U, U>(source: T, ...subset: U[]): T
{
        return Object.assign({}, source, ...subset);
}

export function arrayFromMap<T, U>(
        map: Map.Map<T>, iteratee: Map.Iteratee<T, U> = Func.identity)
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
        getValue: Arr.Iteratee<T, U> = Func.identity): Map.Map<U>
{
        const result: Map.Map<U> = {};
        return array.reduce((result, value, index, array) => {
                const key = getKey(value);
                const returnValue = getValue(value, index, array);
                result[key] = returnValue;
                return result;
        }, result);
}

export function mapFromNameArray<T extends { name: string }>(array: T[])
{
        return mapFromArray<T, T>(array, Func.name, Func.identity);
}
