import Player = require('./player');

/*
        NB. Typescript does not support recursive type definitions of the form
        type X = string | X[]. Hence 'Expression' is defined using a back
        referencing interface type as its resolution is deferred.
*/

export type Atom = string | number | boolean;
export type Expression = Atom | ExpressionArray;
interface ExpressionArray extends Array<Expression> {}

export interface CoreEnv {
        [s: string]: Function;

        ['+']: (...args: number[]) => number;
        ['-']: (...args: number[]) => number;
        ['*']: (...args: number[]) => number;
        ['/']: (...args: number[]) => number;
        not: (value: boolean) => boolean;
        and: (...args: boolean[]) => boolean;
        or: (...args: boolean[]) => boolean;
        ['<']: (...args: number[]) => boolean;
        ['>']: (...args: number[]) => boolean;
        ['=']: (...args: number[]) => boolean;

        define: (name: string, value: Atom, env: CustomEnv) => void;
        set: (name: string, value: Atom, env: CustomEnv) => void;
}

export interface CustomEnv {
        [s: string]: Atom;
}

export interface Env {
        core: CoreEnv;
        custom: CustomEnv;
}

function operatorCheck (
        list: number[], op: (a: number, b: number) => boolean) : boolean
{
        if (list.length < 2) {
                return true;
        } else {
                const [first, ...tail] = list;
                return op(first, tail[0]) && operatorCheck(tail, op);
        }
};

export function standardEnv (
        custom: CustomEnv = customEnv(), core: CoreEnv = coreEnv()): Env
{
        return { core, custom };
}

export function coreEnv (): CoreEnv
{
        return {
                ['+']: (...args: number[]) => args.reduce((a, b) => a + b),
                ['-']: (...args: number[]) => args.reduce((a, b) => a - b),
                ['*']: (...args: number[]) => args.reduce((a, b) => a * b),
                ['/']: (...args: number[]) => args.reduce((a, b) => a / b),
                not: (value: boolean) => !value,
                and: (...args: boolean[]) => args.reduce((a, b) => a && b),
                or: (...args: boolean[]) => args.reduce((a, b) => a || b),
                ['<']: (...args: number[]) => operatorCheck(args, (a, b) => a < b),
                ['>']: (...args: number[]) => operatorCheck(args, (a, b) => a > b),
                ['=']: (...args: number[]) => operatorCheck(args, (a, b) => a === b),
                define: (name: string, value: Atom, env: CustomEnv) => {
                        if (env[name] !== undefined) {
                                throw(`${name} is already defined`);
                        }
                        env[name] = value;
                },
                set: (name: string, value: Atom, env: CustomEnv) => {
                        if (env[name] === undefined) {
                                throw(`${name} is not defined`);
                        }
                        env[name] = value;
                },
        };
}

export function customEnv (): CustomEnv
{
        return {};
}

export function tokenise (script: string): string[]
{
        return script ?
                (script.replace(/\(/g, ' ( ')
                .replace(/\)/g, ' ) ')
                .match(/\S+/g)) : [];
}

export function ast (tokens: string[]): Expression
{
        return tokens.length ?
                astExpression(tokens) : [];
}

export function astExpression (tokens: string[]): Expression
{
        if (tokens.length === 0) {
                throw('Unexpected EOF');
        }

        const token = tokens.shift();
        if (token === '(') {
                if (tokens[tokens.length - 1] !== ')') {
                        throw('Unterminated paranthesis');
                }
                let result: Expression[] = [];
                while (tokens[0] !== ')') {
                        result.push(ast(tokens));
                }
                tokens.shift();
                return result;
        } else if (token === ')') {
                throw('Unexpected )');
        } else {
                return atom(token);
        }
}

export function atom (token: string): Atom
{
        if (isNaN(<number><any>token)) {
                if (token === 'true') {
                        return true;
                } else if (token === 'false') {
                        return false;
                } else {
                        return token;
                }
        } else {
                return Number(token);
        }
}

export function evaluate (expression: Expression, env: Env)
{
        if (Array.isArray(expression)) {
                if (expression.length === 0) {
                        return undefined;
                } else if (Array.isArray(expression[0])) {
                        expression.forEach(exp => evaluateExpression(exp, env));
                        return undefined;
                }
        }
        return evaluateExpression(expression, env);
}

export function evaluateExpression (expression: Expression, env: Env)
        :Atom
{
        if (typeof expression === 'number' || typeof expression ==='boolean') {
                return expression;
        } else if (typeof expression === 'string') {
                if (env.custom[expression] !== undefined) {
                        return <Atom>(env.custom[expression]);
                } else if (expression[0] === '"') {
                        return expression.replace(/"/g, '');
                } else {
                        console.log(`Unrecognised literal ${expression}`);
                        return false;
                }
        } else if (Array.isArray(expression)) {
                const [proc, ...exp] = expression;
                if (proc === 'define') {
                        const [name, val] = exp;
                        env.core.define(name, evaluate(val, env), env.custom);
                        return undefined;
                } else if (proc === 'set') {
                        const [name, val] = exp;
                        env.core.set(name, evaluate(val, env), env.custom);
                        return undefined;
                } else {
                        const args = exp.map(e => evaluate(e, env));
                        return env.core[proc](...args);
                }
        }
}

export function parse (script: string)
{
        const tokens = tokenise(script);
        return ast(tokens);
}

export function parseEval (script: string, env = standardEnv())
{
        const ast = parse(script);
        return evaluate(ast, env);
}

export function getScriptErrors (script: string): string
{
        try {
                parseEval(script);
                return '';
        } catch (e) {
                return e;
        }
}

export function executeScript (script: string, player: Player.PlayerState)
{
        const env = standardEnv(player.vars);
        const result = parseEval(script, env);
        Object.assign(player.vars, env.custom);
        return result;
}
