/// <reference path="../typings/mocha/mocha.d.ts" />
import Kbpgp = require('../core/src/app/kbpgp');

describe('Kbpgp', function () {
        describe('generateKeyPair', function () {
                it('should return key manager instance (may take a few mins)', function () {
                        return Kbpgp.generateKeyPair('john@smith.com');
                })
        })
});
