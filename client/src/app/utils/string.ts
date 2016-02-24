import Map = require('../map/map');

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

export function splitIntoEqualGroups (text: string, groupLength: number)
{
        const split = text.match(new RegExp('.{1,'+groupLength+'}', 'g'));
        return split.join(' ');
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

export function concatClassNames (map: Map.Map<boolean>)
{
        return Map.reduce(map, (result, value, key) => {
                return value ?
                        result + ' ' + key :
                        result;
        }, '');
}
