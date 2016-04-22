import Core = require('./core');
import Br = Core.Br;
import P = Core.P;

export function wrapInLabel (label: string, value: string)
{
        return `${label}: ${value}`;
}

export function createBody (body: string)
{
        const sections = body.split('\n');
        const breaks = sections.reduce((result, section, index) => {
                result.push(section, Br());
                return result;
        }, []);
        return P({}, ...breaks);
}
