export function not<T> (predicate: (val: T) => boolean)
{
        return (val: T) => !predicate(val);
}
