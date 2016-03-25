/// <reference path="global.d.ts"/>
/// <reference path='../../../typings/kbpgp/kbpgp.d.ts'/>

import Arr = require('./utils/array');
import Helpers = require('./utils/helpers');
import Kbpgp = require('kbpgp');
import Log = require('./log');
import Map = require('./utils/map');
import Profile = require('./profile');
import Request = require('./requesttypes');
import Str = require('./utils/string');

export type KeyManagers = Map.Map<Kbpgp.KeyManagerInstance>;

export interface KeyData {
        id: string;
        key: string;
        passphrase?: string;
}

export function createKeyData (): KeyData
{
        return {
                id: null,
                key: null,
                passphrase: null,
        };
}

export function getId<T extends { id: string }>(value: T) { return value.id; }

export function loadFromKeyData (keys: KeyData[])
{
        return loadKeys(keys).then(instances => {
                const ids = keys.map(getId);
                return Map.create(Arr.zip(ids, instances));
        });
}

export function loadKeys (keys: KeyData[])
{
        const promises = keys.map(data =>
                loadKey(data.key, data.passphrase));

        return Promise.all<Kbpgp.KeyManagerInstance>(promises);
}

export function loadPublicKeys (keys: string[])
{
        const promises = keys.map(key => loadKey(key));
        return Promise.all<Kbpgp.KeyManagerInstance>(promises);
}

export function loadKey (key: string, passphrase?: string)
{
        return new Promise<Kbpgp.KeyManagerInstance>((resolve, reject) => {
                const params = { armored: key };
                Kbpgp.KeyManager.import_from_armored_pgp(params,
                        (err, instance) => err ?
                                reject(err) :
                                instance.is_pgp_locked() ?
                                        (instance.unlock_pgp({ passphrase },
                                                err => err ?
                                                        reject(err) :
                                                        resolve(instance))) :
                                        resolve(instance)
                );
        });
}

export function generateKeyPair (userid: string)
{
        return new Promise<Kbpgp.KeyManagerInstance>((resolve, reject) => {
                Kbpgp.KeyManager.generate_rsa({ userid }, (err, instance) => {
                        err ?
                                reject(err) :
                                instance.sign({}, err =>
                                        err ? reject(err) : resolve(instance)
                                );
                });
        });
}

export function signEncrypt (data: EncryptData)
{
        var params = {
                msg: data.text,
                encrypt_for: data.to,
                sign_with: data.from,
        };

        return new Promise<string>((resolve, reject) => {
                Kbpgp.box(params, (err, result) =>
                        err ? reject(err) : resolve(result))
        });
}

export function createKeyRing (instances: Kbpgp.KeyManagerInstance[])
{
        const ring = new Kbpgp.keyring.KeyRing;
        instances.forEach(instance => ring.add_key_manager(instance));
        return ring;
}

export function decryptVerify (
        ring: Kbpgp.keyring.KeyRing | Kbpgp.KeyManagerInstance,
        pgpMsg: string)
{
        return new Promise<string>((resolve, reject) => {
                const params = { keyfetch: ring, armored: pgpMsg };
                Kbpgp.unbox(params, (err, literals) =>
                        err ? reject(err) : resolve(literals[0].toString())
                );
        });
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

export interface EncryptData {
        from: Kbpgp.KeyManagerInstance;
        to: Kbpgp.KeyManagerInstance;
        text: string;
}
