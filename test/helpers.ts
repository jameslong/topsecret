/// <reference path="../typings/es6-polyfill/es6-polyfill.d.ts" />

import Data = require('../core/src/data');
import DBTypes = require('../core/src/dbtypes');
import FileSystem = require('../core/src/filesystem');
import KBPGP = require('../core/src/kbpgp');
import LocalDB = require('../core/src/localdb');
import Main = require('../core/src/main');
import Message = require('../core/src/message');
import Player = require('../core/src/player');
import State = require('../core/src/gamestate');

export function createPlayer0 ()
{
        const email = 'testemailaddress@playtopsecret.com';
        const publicKey = "-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: fnContact PGP \/ Keybase OpenPGP v1.0.0\nComment: https:\/\/fncontact.com\n\nxsBNBFYK0rQBCAC2\/cvLHWw0uguOC6A3DwMJz+i8bSvgLaNccVV1fO3Q4ncoat1h\nJZ\/rlFxfIkbsi4ogDpqNA9yc\/35Z9z8fZpIL\/sWse7p4Qd7pgKGMg\/W+KMz\/\/UMz\nBN1Wj2CPBToz6cU4zPYV60ioM7wrlC+oH3S5wHMX9MhcWKfB+3OX23ATDpzpeqRA\nZP6krCSvLQkJHLD5KhsRFNazsr2ZL455fjdpPRI6WkfORR9\/UhN5CHClXpYPvlJR\nuy3gdBFJHu4gsa97ffEv1nAnkPwcYGY4aH13CN797hvxMRJ81d4GZ8sYVkrai9vX\nRHg4kypntsULked+ubOwINhKkRm8rfFpaHKtABEBAAHNMkplbm5pZmVyIEhhbGwg\nPGNhcmVlcnNAdGVzdG1haWwucGxheXRvcHNlY3JldC5jb20+wsBtBBMBCgAXBQJW\nCtK0AhsvAwsJBwMVCggCHgECF4AACgkQANG0aQMuQFN2EwgAhdJEB\/WIt5ZB2uc3\n5tmd38fB8hYcLmFDfIGzv6NQ2pNcvEoXZa9FqMHBx3s09CqtvuHtW9gGI1qMuk0c\nsYHrvToM3fqPN7Q\/+DZ6RUmbRNVXrnF6ol2N3HbVxP10YfvVA2NqY0fVdfR5v1IN\nLYm61013XC8ic4KuLD1TaoiwDdC0CeA0dCNpAsfKUzHweN5OLQmkgUg46SYvSIWb\nrWNRqXEeF0Ysk6WJP7ZgGI80vdYKewtJk8mpfA4FSi\/VXxdplYIejB+1sT51LZL5\noaTcm7tSZIyC1HE569TibV+XLPQeenTx95WvfpGeNXWtkoR2ZpylNDrSRfF1Fxty\nuVzGPc6NBFYK0rQBBACvQlhyxNYbyF5gz3nlVwQSzmKkuY8Kiid+JBwvwYVI0c56\n\/+VFA\/5SQTdd6LYb\/nN9jL7ZNF9qmsCSAc1YInOSbPGE3c917skf6iCbTmBcGdWW\nKF\/c2jMt\/O5bqVBgoPbfNn4ESrJlfMyYAEIlopj5r3eNInLheFmx8+KeAtYKuwAR\nAQABwsEDBBgBCgAPBQJWCtK0BQkPCZwAAhsuAKgJEADRtGkDLkBTnSAEGQEKAAYF\nAlYK0rQACgkQ9\/Vq5MyemOyH8gQAgPkD7tvFmjFe72iNAMUtuq3HIpV8pTm1lhvx\nP49dNFUVPxrcNaYb\/9H1PBwcwEgqf\/iicaAsFdCOjDZh3NR9PplcIiHHCOuRaOfh\ngG3KeXCA97XJCcDExXwRTzoqy8f1yvHgTNqFX6YroNDhmlD\/r\/MYpcAkvCMggfTH\nrhWi17FGgwf\/WLq968bIv+o6iBQvGax+mkSPvZ0F\/UBYSacWtNZVbwf4uXL+Dw0\/\nOOYAomVCTD6lWSKoNUkts3YABaR8grLr0MBTXVJCIco4B91X6qbrE2i8IWa3GF+8\nrAmoHQjoUUr4VSEWnKh+AyHReZ+tDprNJx6O5DFyu892sQVZflTxb8rwV69aop5I\nDZSQsHKIP+ow1Zaz8K6Plm+TSLCgkhkk60EgFvGcUcAfJ6AOBL4blx\/mD22BfRf0\nGbK5iYCWfaUvZUIvUPkFzvTnjLjs0g8QkBO9Vc8TJVfo0Fmty9USlVpv2wlj2eBn\nmvFIQErCY9DlkIvF5Os5wXgJOx+N5Ce\/8M6NBFYK0rQBBADG\/P1v1estqFYhKoZS\n1\/a2JyGvgWTuHHF1hhTUC4RYzd8WSv7c0on\/2te3z7KkVPvJaknvOfmVszj5pb\/S\nz7ofyUgj6I2825JtZwtQbARzHX25KWLHDeI7fT1nCSQxddw\/URrKdLt24YcnHCFm\nP0kHtuxp2astDlXlrWFTtXs2hwARAQABwsEDBBgBCgAPBQJWCtK0BQkPCZwAAhsu\nAKgJEADRtGkDLkBTnSAEGQEKAAYFAlYK0rQACgkQCrw0qZ8beHuN8AP7BeRNR1Vt\ntI6\/tugNfsAJwbI1yhTNYcvrnUgoDZH9k0UZc1GRTodQxw4IpAEfqdpT3AYWawde\n54rvQYcKjdccYrQ7IWTJC+jRnxpC2Rd4EaAnspwnWmlbFlD4MsoTdjEtxmOEBvpp\nQHpkERMFmRJgUaIz1OpAvEz+Zs+F\/y9Y5cEtrwf\/Yt5Fcx6gXq2Dm85+Qp1cMEi5\nh2u6+JJg26doXQPkz1sOT4WfB8XXPDReh4lIXq1Y5KOIaKJQuH7Uyfp6WRzaGFUz\n48YdKIDOdx2ZIqbWWHYVWS9LdSqamRB\/7omiOnjjQlZ4Y8AF5ZUgpbLDn930v4Kw\n8UdEPj1uQzq04W58EpqDyLLA8MqIWyujfsRq6PrQBVVmkDOkx6JseTODHOVytb3H\ntaZ13mMSRRpL0xK\/Ji5XWCQLGJ8XWrEZi5EAC07hPDN3WPgoghoFU6btLYYGbMFw\nX5PGnrA3IUYUOGi5ZF2hO\/BdlZ\/uUejDtprt2YD6MpETt+QM7Mlr5bcgzF+q0w==\n=MZ\/z\n-----END PGP PUBLIC KEY BLOCK-----";
        const firstName = 'John';
        const lastName = 'Smith';
        const version = 'test';
        const timezoneOffset = 0;
        return Player.createPlayerState(
                email, publicKey, version, firstName, lastName, timezoneOffset);
}

export function createMessage0 ()
{
        const email = 'testemailaddress@playtopsecret.com';
        const id = '<0.john@smith.com>';
        const version = 'Test';
        const name = 'test';
        const threadStartName: string = null;
        const numberOfChildren = 3;
        const sentTimestampMs = 1465226704795;
        return Message.createMessageState(
                email,
                id,
                name,
                sentTimestampMs,
                threadStartName,
                numberOfChildren);
}

export function createMessage1 ()
{
        const email = 'testemailaddress@playtopsecret.com';
        const id = '<1.john@smith.com>';
        const version = 'Test';
        const name = 'test';
        const threadStartName: string = null;
        const numberOfChildren = 2;
        const sentTimestampMs = 1465226704795;
        return Message.createMessageState(
                email,
                id,
                name,
                sentTimestampMs,
                threadStartName,
                numberOfChildren);
}

export function createMessage (
        name: string, email: string, groupData: State.NarrativeState)
{
        const id = `<${name}.${email}>`;
        const threadStartName: string = null;
        const messageData = groupData.messages[name];
        const numberOfChildren = messageData.children.length;
        const sentTimestampMs = Date.now();
        return Message.createMessageState(
                email,
                id,
                name,
                sentTimestampMs,
                threadStartName,
                numberOfChildren);
}

export function testGameData ()
{
        const contentPath = 'content';
        const groupName = 'test_data';
        return Data.loadGameData(contentPath, groupName);
}

const delayMs = 10;
export const createDB = () => LocalDB.createLocalDBCalls(
        LocalDB.createDB(), delayMs);

let idCounter = 0;
function generateMessageId (): string
{
        var id = idCounter.toString();
        idCounter += 1;
        return id;
}

function createSendFn ()
{
        return (messageData: Message.MessageData) =>
                Promise.resolve(generateMessageId());
}

export function createPromises ()
{
        const db = createDB();
        const send = createSendFn();
        return DBTypes.createPromiseFactories(db, send);
}
