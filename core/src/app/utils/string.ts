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
        return byLines(text, text => prepend(prefix, text));
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

export function splitByLines (text: string)
{
        return text.split('\n');
}

export function joinLines (lines: string[])
{
        return lines.join('\n');
}

export function byLines (text: string, iteratee: (line: string) => string)
{
        const lines = splitByLines(text);
        const newLines = lines.map(iteratee);
        return joinLines(newLines);
}

export function splitIntoEqualGroups (text: string, groupLength: number)
{
        const split = text.match(new RegExp('.{1,'+groupLength+'}', 'g'));
        return split.join(' ');
}

export function filterByLines (
        text: string, predicate: (line: string) => boolean)
{
        const lines = splitByLines(text);
        const newLines = lines.filter(predicate);
        return joinLines(newLines);
}

export function beginsWith (text: string, match: string)
{
        return text.indexOf(match) === 0;
}
