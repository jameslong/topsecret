import Map = require('./utils/map');

/*
        NB. Typescript does not support recursive type definitions of the form
        type X = string | X[]. Hence 'Expression' is defined using a back
        referencing interface type as its resolution is deferred.
*/

type Atom = string | number | boolean;
type Expression = Atom | ExpressionArray;
interface ExpressionArray extends Array<Expression> {}

interface Env {
        define: (name: string, value: Atom) => void;
        set: (name: string, value: Atom) => void;

        ['+']: (a: number, b: number) => number;
        ['-']: (a: number, b: number) => number;
        ['*']: (a: number, b: number) => number;
        ['/']: (a: number, b: number) => number;
        not: (value: boolean) => boolean;
        and: (a: boolean, b: boolean) => boolean;
        or: (a: boolean, b: boolean) => boolean;
        ['<']: (a: number, b: number) => boolean;
        ['>']: (a: number, b: number) => boolean;
        ['=']: (a: number, b: number) => boolean;
}

function tokenise (script: string)
{
        return (script.replace(/\(/g, ' ( ')
                .replace(/\)/g, ' ) ')
                .match(/\S+/g));
}

function ast (tokens: string[]): Expression
{
        if (tokens.length === 0) {
                throw('Unexpected EOF');
        }

        const token = tokens[0];
        if (token === '(') {
                if (tokens[tokens.length - 1] !== ')') {
                        throw('Unterminated paranthesis');
                }
                const expression = tokens.slice(1, -1);
                return [ast(expression)];
        } else if (token === ')') {
                throw('Unexpected )');
        } else {
                return atom(token);
        }
}

function atom (token: string)
{
        return isNan(token) ?
                token : Number(token);
}

function eval (expression: Expression, env: Env, vars: Map.Map<Atom>)
{
        if (typeof expression === 'number' || typeof expression ==='boolean') {
                return expression;
        } else if (typeof expression === 'string') {
                if (vars[expression] !== undefined) {
                        return vars[expression];
                } else {
                        const [proc, ...exp] = expression;
                        if (proc === 'define') {
                                const [name, val] = exp;
                                vars[name] = eval(val, env, vars);
                        } else if (expression[0] === 'set') {
                                const [name, val] = exp;
                                vars[name] = eval(val, env, vars);
                        } else {
                                const args = exp.map(e => eval(e, env, vars));
                                return env[proc](...args);
                        }
                }
}
