export interface Map<T> {
        [s: string]: T;
}

export function mergeMaps<T> (maps: Map<T>[]): Map<T>
{
        var result: Map<T> = {};
        maps.forEach(function (map)
                {
                        for (var key in map) {
                                if (map.hasOwnProperty(key)) {
                                        result[key] = map[key];
                                }
                        }
                });

        return result;
}

export function mapFromArray<T extends {name: string}> (list: T[]): Map<T>
{
        var returnObj: Map<T> = {};

        list.forEach(function (elem)
        {
                returnObj[elem.name] = elem;
        });

        return returnObj;
}

export function arrayFromMap<T> (object: Map<T>): T[]
{
        var returnList: T[] = [];

        for (var key in object) {
                if (object.hasOwnProperty(key)) {
                        returnList.push(object[key]);
                }
        }

        return returnList;
}

export function map<T, U> (
        object: Map<T>,
        iteratee: (value: T, key: string, object: Map<T>)=>U): Map<U>
{
        var result: Map<U> = {};

        for (var key in object) {
                if (object.hasOwnProperty(key)) {
                        result[key] = iteratee(object[key], key, object);
                }
        }

        return result;
}

export function mapToArray<T, U> (
        object: Map<T>, iteratee: (value: T, key: string)=>U): U[]
{
        var result: U[] = [];

        for (var key in object) {
                if (object.hasOwnProperty(key)) {
                        result.push(iteratee(object[key], key));
                }
        }

        return result;
}

export function filter<T> (
        object: Map<T>,
        predicate: (value: T, key: string, object: Map<T>)=>boolean): Map<T>
{
        var result: Map<T> = {};

        for (var key in object) {
                if (object.hasOwnProperty(key) &&
                    predicate(object[key], key, object)) {
                        result[key] = object[key];
                }
        }

        return result;
}

export function every<T> (
        object: Map<T>, predicate: (value: T, key: string)=>boolean): boolean
{
        return (Object.keys(filter(object, predicate)).length ===
                Object.keys(object).length);
}

export function forEach<T> (
        object: Map<T>, iteratee: (value: T, key: string)=>any)
{
        for (var key in object) {
                if (object.hasOwnProperty(key)) {
                        iteratee(object[key], key);
                }
        }
}

export function valueOf<T> (
        object: Map<T>, predicate: (value: T, key: string)=>boolean): T
{
        for (var key in object) {
                if (object.hasOwnProperty(key) && predicate(object[key], key)) {
                        return object[key];
                }
        }

        return null;
}

export function exists<T> (object: Map<T>, key: string): boolean
{
        return (object[key] !== undefined);
}

export function extractN<T> (
        object: Map<T>, startKey: string, maxResults: number)
        : { items: T[], lastEvaluatedKey: string }
{
        var keys = Object.keys(object);
        var length = keys.length;

        var items: T[] = [];
        var lastEvaluatedKey: string = null;

        if (length > 0) {
                var startKeyIndex = keys.indexOf(startKey);
                var startIndex = ((startKeyIndex === -1) ? 0 : startKeyIndex);
                var section = keys.slice(startIndex, startIndex + maxResults);
                items = section.map((key) => object[key]);

                lastEvaluatedKey = section[section.length - 1];
        }

        return {
                lastEvaluatedKey: lastEvaluatedKey,
                items: items,
        };
}
