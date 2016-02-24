/// <reference path="global.d.ts"/>
/// <reference path="../typings/kbpgp/kbpgp.d.ts"/>
import Arr = require('./utils/array');
import Data = require('./data');
import Kbpgp = require('kbpgp');
import Helpers = require('./utils/helpers');
import Map = require('./map/map');
import Str = require('./utils/string');

export interface KeyData {
        id: string;
        passphrase: string;
        privateKey: string;
}

export function createKeyData (): KeyData
{
        return {
                id: null,
                passphrase: null,
                privateKey: null,
        };
}

export function loadFromKeyData (
        keys: KeyData[],
        callback: (err: Error, managers: Map.Map<Kbpgp.KeyManagerInstance>) => void)
{
        loadPrivateKeys(keys, (err, instances) => {
                if (err) {
                        return callback(err, null);
                } else {
                        const ids = keys.map(Data.getId);
                        const instanceMap = Map.create(Arr.zip(ids, instances));
                        return callback(null, instanceMap)
                }
        });
}

export function loadPrivateKeys (
        keys: KeyData[],
        callback: (err: Error, managers: Kbpgp.KeyManagerInstance[]) => void)
{
        const promises = keys.map(data =>
                generateKeyPairPromise(data.privateKey, data.passphrase));

        Promise.all<Kbpgp.KeyManagerInstance>(promises)
        .then(instances => {
                return callback(null, instances)
        })
        .catch((err) => callback(err, null));
}

export function loadPublicKeys (
        keys: string[],
        callback: (err: Error, managers: Kbpgp.KeyManagerInstance[]) => void)
{
        const promises = keys.map(key => generateKeyPairPromise(key));

        Promise.all<Kbpgp.KeyManagerInstance>(promises)
        .then(instances => {
                return callback(null, instances)
        })
        .catch((err) => callback(err, null));
}

export function generateKeyPairPromise (key: string, passphrase?: string)
{
        return new Promise((resolve, reject) =>
                loadKey(key, passphrase, (err, instance) =>
                        (err ? reject(err) : resolve(instance)))
        );
}

export function loadKey (
        key: string,
        passphrase: string,
        callback: (err: Kbpgp.Error, instance: Kbpgp.KeyManagerInstance) => void)
{
        Kbpgp.KeyManager.import_from_armored_pgp(
                { armored: key },
                (err, instance) => (err || !instance.is_pgp_locked() ?
                        callback(err, instance) :
                        instance.unlock_pgp(
                                { passphrase: passphrase },
                                (err) => callback (err, instance)))
        );
}

export function generateKeyPair (
        userid: string,
        callback: (err: Kbpgp.Error, instance: Kbpgp.KeyManagerInstance) => void)
{
        Kbpgp.KeyManager.generate_rsa({ userid }, (err, instance) => {
                if (instance) {
                        instance.sign({}, (err) => {
                                callback(err, instance);
                        });
                } else {
                        callback(err, instance);
                }
        });
}

export function signEncrypt (
        from: Kbpgp.KeyManagerInstance,
        to: Kbpgp.KeyManagerInstance,
        text: string,
        callback: (err: Kbpgp.Error, result: string) => void)
{
        var params = {
                msg: text,
                encrypt_for: to,
                sign_with: from,
        };

        Kbpgp.box(params, callback);
}

export function createKeyRing (instances: Map.Map<Kbpgp.KeyManagerInstance>)
{
        const ring = new Kbpgp.keyring.KeyRing;
        const kms = Helpers.arrayFromMap(instances, Helpers.identity);
        kms.forEach(instance => ring.add_key_manager(instance));
        return ring;
}

export function decryptVerify (
        ring: Kbpgp.keyring.KeyRing,
        pgpMsg: string,
        callback: (err: Kbpgp.Error, result: string) => void)
{
        Kbpgp.unbox({ keyfetch: ring, armored: pgpMsg }, (err, literals) =>
                err ?
                        callback(err, null) :
                        callback(err, literals[0].toString())
        );
}

export function getKeyManagerById (
        instances: Map.Map<Kbpgp.KeyManagerInstance>, id: string)
{
        return Map.find(instances, (instance, instanceId) => instanceId === id);
}

export function getDisplayType (instance: Kbpgp.KeyManagerInstance)
{
        return instance.has_pgp_private() ? 'public/private' : 'public';
}

export function getUserId (instance: Kbpgp.KeyManagerInstance)
{
        return instance.get_userids()[0].utf8();
}

export function extractPublicKeys (text: string) {
        const regex = /-----BEGIN PGP PUBLIC KEY BLOCK(([^])+?)END PGP PUBLIC KEY BLOCK-----/g;
        return Str.getAllMatches(text, regex);
}
