import DBTypes = require('./dbtypes');
import KBPGP = require('./kbpgp');
import Log = require('./log');
import Map = require('./utils/map');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Profile = require('./profile');
import ReplyOption = require('./replyoption');
import Script = require('./script');
import State = require('./state');

export function handleReplyMessage (
        reply: Message.Reply,
        timestampMs: number,
        data: Map.Map<State.GameData>,
        promises: DBTypes.PromiseFactories)
{
        const email = reply.from;
        const inReplyToId = reply.inReplyToId;

        return promises.getMessage(inReplyToId).then(message =>
                message && !message.reply ?
                        promises.getPlayer(email).then(player =>
                                handleTimelyReply(
                                        reply,
                                        timestampMs,
                                        player,
                                        message,
                                        data,
                                        promises)) :
                        null
        );
}

export function handleTimelyReply (
        reply: Message.Reply,
        timestampMs: number,
        player: Player.PlayerState,
        message: Message.MessageState,
        data: Map.Map<State.GameData>,
        promises: DBTypes.PromiseFactories)
{
        const groupName = player.version;
        const groupData = data[groupName];
        const ciphertext = reply.body;
        const profiles = groupData.profiles;
        const profile = Profile.getProfileByEmail(reply.to, profiles);
        const keyManager = groupData.keyManagers[profile.name];

        const messageName = message.name;
        const messageState = groupData.messages[messageName];
        const hasReplyOptions = messageState.replyOptions.length > 0;

        if (hasReplyOptions) {
                return player.publicKey ?
                        KBPGP.loadKey(player.publicKey).then(from => {
                                const keyManagers = [keyManager, from];
                                const keyRing = KBPGP.createKeyRing(keyManagers);
                                return KBPGP.decryptVerify(keyRing, ciphertext).then(plaintext =>
                                        handleDecryptedReplyMessage(
                                                plaintext,
                                                timestampMs,
                                                player,
                                                message,
                                                groupData,
                                                promises)
                                );
                        }) :
                        handleDecryptedReplyMessage(
                                ciphertext,
                                timestampMs,
                                player,
                                message,
                                groupData,
                                promises);
        } else {
                return null;
        }
}

export function handleDecryptedReplyMessage (
        body: string,
        timestampMs: number,
        player: Player.PlayerState,
        messageState: Message.MessageState,
        groupData: State.GameData,
        promises: DBTypes.PromiseFactories)
{
        const threadMessage = groupData.messages[messageState.name];
        const replyOptions = groupData.replyOptions;
        const messageReplyOptions = replyOptions[threadMessage.replyOptions];
        const indices = messageReplyOptions.map((option, index) => index);
        const conditions = indices.filter(index => {
                const option = messageReplyOptions[index];
                const condition = option.messageDelay.condition;
                return !condition ||
                        <boolean><any>Script.executeScript(condition, player);
        });
        const matched = conditions.filter(index =>
                ReplyOption.isValidReply(body, messageReplyOptions[index]));

        if (matched.length) {
                messageState.reply = { indices: matched, timestampMs, sent: [] };
                return promises.addMessage(messageState);
        } else {
                return null;
        }
}

export function handleReplyOptionValidPGPKey(
        body: string,
        timestampMs: number,
        replyIndex: number,
        player: Player.PlayerState,
        message: Message.MessageState,
        promises: DBTypes.PromiseFactories)
{
        const publicKey = ReplyOption.extractPublicKey(body);
        player.publicKey = publicKey;

        return promises.updatePlayer(player).then(player => {
                const indices = [replyIndex];
                const sent: number[] = [];
                message.reply = { indices, sent, timestampMs };
                return promises.updateMessage(message)
        });
}
