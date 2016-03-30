/// <reference path="../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../core/src/app/global.d.ts"/>
import Script = require('../core/src/app/script');

import Chai = require('chai');
const assert = Chai.assert;

function tokeniseAssert (input: string, expectedOutput: string[])
{
        const output = Script.tokenise(input);
        return assert.deepEqual(output, expectedOutput);
}

function parseAssert (input: string, expectedOutput: Script.Expression)
{
        const output = Script.parse(input);
        return assert.deepEqual(output, expectedOutput);
}

function evalAssert (
        input: string,
        expectedOutput: any,
        env: Script.Env = Script.standardEnv())
{
        const output = Script.parseEval(input, env);
        return assert.deepEqual(output, expectedOutput);
}

describe('Script', function () {
        describe('tokenise', function () {
                it('should split string into tokens', function () {
                        const input = '() (testing x y z)';
                        const output =
                                ['(', ')', '(', 'testing', 'x', 'y', 'z', ')'];
                        tokeniseAssert(input, output);
                })
        });

        describe('ast', function () {
                it('should generate AST from boolean atom', function () {
                        const input = 'true';
                        const output = true;
                        parseAssert(input, output);
                })

                it('should generate AST from number atom', function () {
                        const input = '5';
                        const output = 5;
                        parseAssert(input, output);
                })

                it('should generate AST from string atom', function () {
                        const input = '"emily"';
                        const output = '"emily"';
                        parseAssert(input, output);
                })

                it('should generate AST from an expression', function () {
                        const input = '(set x (+ x 1))';
                        const output = ['set', 'x', ['+', 'x', 1]];
                        parseAssert(input, output);
                })
        });

        describe('evaluate', function () {
                describe('atoms', function () {
                        it('should evaluate to true', function () {
                                const input = 'true';
                                const output = true;
                                evalAssert(input, output);
                        })

                        it('should evaluate to false', function () {
                                const input = 'false';
                                const output = false;
                                evalAssert(input, output);
                        })

                        it('should evaluate to a number', function () {
                                const input = '5';
                                const output = 5;
                                evalAssert(input, output);
                        })

                        it('should evaluate to a string', function () {
                                const input = '"emily"';
                                const output = 'emily';
                                evalAssert(input, output);
                        })
                });

                describe('operators', function () {
                        it('add', function () {
                                const input = '(+ 1 2 3)';
                                const output = 6;
                                evalAssert(input, output);
                        })

                        it('subtract', function () {
                                const input = '(- 1 2 3)';
                                const output = -4;
                                evalAssert(input, output);
                        })

                        it('multiply', function () {
                                const input = '(* 1 2 3)';
                                const output = 6;
                                evalAssert(input, output);
                        })

                        it('divide', function () {
                                const input = '(/ 6 3 2)';
                                const output = 1;
                                evalAssert(input, output);
                        })

                        it('lessThan', function () {
                                const falseInput = '(< 1 3 2)';
                                const trueInput = '(< 1 2 3)';
                                evalAssert(falseInput, false);
                                evalAssert(trueInput, true);
                        })

                        it('greaterThan', function () {
                                const falseInput = '(> 1 3 2)';
                                const trueInput = '(> 3 2 1)';
                                evalAssert(falseInput, false);
                                evalAssert(trueInput, true);
                        })

                        it('equals', function () {
                                const falseInput = '(= 1 1 2)';
                                const trueInput = '(= 1 1 1)';
                                evalAssert(falseInput, false);
                                evalAssert(trueInput, true);
                        })

                        it('not', function () {
                                const falseInput = '(not true)';
                                const trueInput = '(not false)';
                                evalAssert(falseInput, false);
                                evalAssert(trueInput, true);
                        })

                        it('and', function () {
                                const falseInput = '(and true true false)';
                                const trueInput = '(and true true true)';
                                evalAssert(falseInput, false);
                                evalAssert(trueInput, true);
                        })

                        it('or', function () {
                                const falseInput = '(or false false false)';
                                const trueInput = '(or false true false)';
                                evalAssert(falseInput, false);
                                evalAssert(trueInput, true);
                        })
                });

                describe('define', function () {
                        it('should define new variable', function () {
                                const input = '(define x 5)';
                                const env = Script.standardEnv();
                                Script.parseEval(input, env);
                                assert.deepEqual(env['x'], 5);
                        })
                });

                describe('set', function () {
                        it('should set variable value', function () {
                                const input = '((define x 0)(set x 5))';
                                const env = Script.standardEnv();
                                Script.parseEval(input, env);
                                assert.deepEqual(env['x'], 5);
                        })
                });

                describe('read variable', function () {
                        it('should return the variable value', function () {
                                const define = '(define x "emily")';
                                const read = 'x';
                                const env = Script.standardEnv();
                                const output = 'emily';
                                Script.parseEval(define, env);
                                evalAssert(read, output, env);
                        })
                });

                describe('update variable using previous value', function () {
                        it('should return the variable value', function () {
                                const input = '((define x 5)(set x (+ x 1)))';
                                const env = Script.standardEnv();
                                const read = 'x';
                                const output = 6;
                                Script.parseEval(input, env);
                                evalAssert(read, output, env);
                        })
                });
        });
});
