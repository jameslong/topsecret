import Core = require('./core');
import Br = Core.Br;
import P = Core.P;

export function wrapInLabel (label: string, value: string)
{
        return `${label}: ${value}`;
}

export function createBody (body: string)
{
        const ps = body.split('\n\n');
        const contents = ps.map(text => text.split('\n'));
        return contents.map((p, index) => {
                let quoted = false;
                const brs = p.reduce((result, item) => {
                        if (item.length && item[0] === '>') {
                                quoted = true;
                        }
                        result.push(item, Br());
                        return result;
                }, []);
                const className = quoted ? 'quoted' : null;
                const key = index;
                const props = { className, key };
                return P(props, ...brs);
        });
}
