export function contains (superset: string, subset: string): boolean
{
        var supersetLC = superset.toLowerCase();
        var subsetLC = subset.toLowerCase();

        return (supersetLC.indexOf(subsetLC) !== -1);
}

export function containsWord (superset: string, subset: string): boolean
{
        return new RegExp( '\\b' + subset + '\\b', 'i').test(superset);
}

export function split<T> (
        text: string, separator: string, replacer: (text: string) => T): T[]
{
        var parts = text.split(separator);
        return parts.map(replacer);
}

export function removeFileExtension (text: string)
{
        return text.substr(0, text.lastIndexOf('.'));
}
