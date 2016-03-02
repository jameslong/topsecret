export function identity<T>(value: T) { return value; }

export function assign<T extends U, U>(source: T, ...subset: U[]): T
{
        return Object.assign({}, source, ...subset);
}
