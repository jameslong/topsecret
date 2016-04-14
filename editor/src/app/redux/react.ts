interface ClassNameObject {
        [i: string]: boolean;
}
type ClassNameProperty = ClassNameObject | string;

export function classNames (...props: ClassNameProperty[])
{
        return props.reduce((result: string, value: ClassNameProperty) => {
                if (typeof value === 'string') {
                        return `${result} ${value}`;
                } else {
                        return objectClassNames(value, result);
                }
        });
}

function objectClassNames (props: ClassNameObject, result: string)
{
        const keys: string[] = Object.keys(props);
        return keys.reduce((result, key, index, keys) => {
                const value = props[key];
                return value ? `${result} ${key}` : result;
        }, result);
}
