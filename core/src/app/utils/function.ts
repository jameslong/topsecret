export function identity<T> (value: T) { return value }
export function name<T extends { name: string }> (value: T) { return value.name }

export function not<T> (predicate: (val: T) => boolean)
{
        return (val: T) => !predicate(val);
}
