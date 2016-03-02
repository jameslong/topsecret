import Map = require('./map');

export function concatClassNames (map: Map.Map<boolean>)
{
        return Map.reduce(map, (result, value, key) => {
                return value ?
                        result + ' ' + key :
                        result;
        }, '');
}

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

export function getAllMatches (text: string, regex: RegExp)
{
        let result: string[] = [];
        let execResult: RegExpExecArray = null;
        while ((execResult = regex.exec(text)) !== null) {
                result.push(execResult[0]);
        }
        return result;
}

export function prepend (prefix: string, text: string)
{
        return prefix + text;
}

export function prependToLines (prefix: string, text: string)
{
        const lines = text.split('\n');
        const newLines = lines.map(text => prepend(prefix, text));
        return newLines.join('\n');
}

export function removeFileExtension (text: string)
{
        return text.substr(0, text.lastIndexOf('.'));
}

export function split<T> (
        text: string, separator: string, replacer: (text: string) => T): T[]
{
        var parts = text.split(separator);
        return parts.map(replacer);
}

export function splitIntoEqualGroups (text: string, groupLength: number)
{
        const split = text.match(new RegExp('.{1,'+groupLength+'}', 'g'));
        return split.join(' ');
}
