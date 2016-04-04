import Immutable = require('immutable');

export function log<K, V>(object: Immutable.Iterable<K, V>)
{
        console.log(object.toJS());
}

export function listFromArray<U, V>(
        array: U[], iteratee: (value: U) => V)
{
        const temp = Immutable.List<V>();
        return temp.withMutations(
                result => array.forEach(
                        value => result.push(iteratee(value))
                )
        );
}

export function mapFromObject<U, V>(
        object: { [key: string]: U }, iteratee: (value: U) => V)
{
        const temp = Immutable.Map<string, V>();
        return temp.withMutations(result => {
                for (let key in object) {
                        if (object.hasOwnProperty(key)) {
                                result.set(key, iteratee(object[key]));
                        }
                }
        });
}

export function keys<U>(map: Immutable.Map<U, any>): Immutable.List<U>
{
        const temp = Immutable.List<U>();
        return temp.withMutations(result => {
                map.forEach((value, key) => result.push(key));
        });
}

export function map<U, V> (
        list: Immutable.List<U>,
        iteratee: (value: U, index: number) => V)
        : Immutable.List<V>
{
        return <Immutable.List<V>>list.map(iteratee);
}

export function filter<U> (
        list: Immutable.List<U>,
        predicate: (value: U, index: number) => boolean)
{
        return <Immutable.List<U>>list.filter(predicate);
}


export function concat<U> (
        listA: Immutable.List<U>, listB: Immutable.List<U>)
{
        return <Immutable.List<U>>listA.concat(listB);
}

export function getMapSubset<U, V>(
        map: Immutable.Map<U, V>, keys: Immutable.List<U>)
{
        const temp = Immutable.Map<U, V>();
        return temp.withMutations(result => {
                keys.forEach(
                        key => {
                                const value = map.get(key);
                                result.set(key, value);
                        }
                )
        });
}

export function getUpdated<U, V>(
        previous: Immutable.Map<U, V>, current: Immutable.Map<U, V>)
{
        return current.filter(
                (value, key) => value !== previous.get(key));
}

export function getRemoved<U, V>(
        previous: Immutable.Map<U, V>, current: Immutable.Map<U, V>)
{
        return previous.filter(
                (value, key) => !current.has(key));
}
