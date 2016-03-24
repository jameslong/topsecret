import DBTypes = require('./dbtypes');
import KBPGP = require('./kbpgp');
import Log = require('./log');
import Map = require('./utils/map');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Profile = require('./profile');
import ReplyOption = require('./replyoption');
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
        ).then(result => reply);
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
        const replyOptions = threadMessage.replyOptions;
        const replyIndex = ReplyOption.getReplyIndex(body, replyOptions);

        handleSelectedReply(
                body,
                timestampMs,
                replyIndex,
                threadMessage,
                player,
                messageState,
                promises);
}

export function handleSelectedReply (
        body: string,
        timestampMs: number,
        replyIndex: number,
        threadMessage: Message.ThreadMessage,
        player: Player.PlayerState,
        messageState: Message.MessageState,
        promises: DBTypes.PromiseFactories)
{
        const selectedOption = threadMessage.replyOptions[replyIndex];
        const id = messageState.id;

        switch (selectedOption.type) {
        case ReplyOption.ReplyOptionType.ValidPGPKey:
                const validOption = <ReplyOption.ReplyOptionValidPGPKey>selectedOption;
                return handleReplyOptionValidPGPKey(
                        body,
                        timestampMs,
                        replyIndex,
                        player,
                        messageState,
                        promises);

        default:
                return handleReplyOptionDefault(
                        timestampMs,
                        replyIndex,
                        messageState,
                        promises);
        }
}

export function handleReplyOptionDefault (
        timestampMs: number,
        replyIndex: number,
        message: Message.MessageState,
        promises: DBTypes.PromiseFactories)
{
        message.reply = { replyIndex, timestampMs };
        return promises.addMessage(message);
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
                message.reply = { replyIndex, timestampMs };
                return promises.updateMessage(message)
        });
}
