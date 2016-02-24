/// <reference path='../../../typings/kbpgp/kbpgp.d.ts'/>

import Map = require('./utils/map');
import Log = require('./log/log');
import Profile = require('./profile');
import Request = require('./requesttypes');

import kbpgp = require('kbpgp');

export type KeyManagers = Map.Map<kbpgp.KeyManagerInstance>;

export function loadKeyData (
        profiles: Map.Map<Profile.Profile>,
        callback: (error: Request.Error, instances: KeyManagers) => void)
{
        var tasks = createKeyManagerTasks(profiles);

        Request.parallelObject(tasks,
                function (
                        error: Request.Error,
                        keyManagers: Map.Map<kbpgp.KeyManagerInstance>)
                {
                        if (error) {
                                Log.debug('Failed to generate keymanagers',
                                        error);
                        }

                        callback(error, keyManagers);
                });
}

export function createKeyManagerTasks (profiles: Map.Map<Profile.Profile>)
        : Map.Map<Request.InitialRequestFunc<kbpgp.KeyManagerInstance>>
{
        var tasks: Map.Map<Request.InitialRequestFunc<kbpgp.KeyManagerInstance>> = {};

        return Map.map(profiles, (profile) => {
                        var privateKey = profile.privateKey;
                        var passphrase = profile.passphrase;
                        return (callback: Request.Callback<kbpgp.KeyManagerInstance>) => {
                                createKeyManagerFromPrivateKey(
                                        privateKey,
                                        passphrase,
                                        callback);
                        };

                });
}

export function createKeyManagerFromPublicKey (
        publicKey: string, callback: (keyManager: any)=>void)
{
        var onKeyManager = function (error: string, keyManager: any)
                {
                        if (error) {
                                Log.info('keyManagerError', error);
                        }

                        return callback(keyManager);
                };

        var params = {
                armored: publicKey,
        };

        kbpgp.KeyManager.import_from_armored_pgp(params, onKeyManager);
}

export function createKeyManagerFromPrivateKey (
        privateKey: string,
        passphrase: string,
        callback: Request.Callback<kbpgp.KeyManagerInstance>)
{
        var onUnlockedKeyManager = function (
                        error: string, keyManager: kbpgp.KeyManagerInstance)
                {
                        if (error) {
                                Log.debug('keyManagerUnlockError', error);
                                var awsError: Request.Error = {
                                        code: null,
                                        message: error,
                                };
                                callback(awsError, null);
                        } else {
                                callback(null, keyManager);
                        }
                };

        var onKeyManager = function (
                        error: string, keyManager: kbpgp.KeyManagerInstance)
                {
                        if (error) {
                                Log.debug('keyManagerImportError', error);
                                const awsError: Request.Error = {
                                        code: null,
                                        message: error,
                                };
                                callback(awsError, null);
                        } else if (keyManager.is_pgp_locked()) {
                                keyManager.unlock_pgp({
                                        passphrase: passphrase
                                }, function (error: string)
                                        {
                                                return onUnlockedKeyManager(
                                                        error, keyManager);
                                        });
                        } else {
                                callback(null, keyManager);
                        }
                };

        var params = {
                armored: privateKey,
        };

        kbpgp.KeyManager.import_from_armored_pgp(params, onKeyManager);
}

export function encryptMessage (
        gameKeyManager: kbpgp.KeyManagerInstance,
        plaintext: string,
        publicKey: string,
        callback: (ciphertext: string)=>void)
{
        try {
                createKeyManagerFromPublicKey(publicKey,
                        function (playerKeyManager: kbpgp.KeyManagerInstance)
                        {
                                var params = {
                                        msg: plaintext,
                                        encrypt_for: playerKeyManager,
                                        sign_with: gameKeyManager,
                                };
                                kbpgp.box(params, function(
                                                error: string, ciphertext: string)
                                        {
                                                if (error) {
                                                        Log.info('encryptError', error);
                                                }
                                                callback(ciphertext);
                                        });
                        });
        } catch (error) {
                var errorOjb = {
                        plaintext: plaintext,
                        publicKey: publicKey,
                        error: error,
                };
                Log.info('Failed to encrypt message', errorOjb);
                callback(plaintext);
        }
}

export function decryptMessage (
        receiverKeyManager: kbpgp.KeyManagerInstance,
        ciphertext: string,
        callback: (error: string, plaintext: string)=>void)
{
        var onUnbox = function (error: string, literals: kbpgp.Literal[])
                {
                        if (error) {
                                Log.info('decryptError', error);
                                callback(error, null);
                        } else {
                                var plaintext = literals[0].toString();
                                callback(error, plaintext);
                        }
                };

        var params = {
                keyfetch: receiverKeyManager,
                armored: ciphertext,
        };

        kbpgp.unbox(params, onUnbox);
}
