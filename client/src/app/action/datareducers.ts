import Actions = require('./actions');
import Clock = require('../clock');
import Data = require('../data');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Map = require('../../../../core/src/app/utils/map');
import Message = require('../message');
import Redux = require('../redux/redux');

export function data (data: Data.Data, action: Redux.Action<any>)
{
        switch (action.type) {
                case Actions.Types.DIPLAY_MESSAGE:
                        const displayAction = <Actions.DisplayMessage><any>action;
                        return handleDisplayMessage(data, displayAction);

                case Actions.Types.RECEIVE_REPLY:
                        const receiveAction = <Actions.ReceiveReply><any>action;
                        return handleReceiveReply(data, receiveAction);

                case Actions.Types.SEND_MESSAGE:
                        const sendAction = <Actions.SendMessage><any>action;
                        return handleSendMessage(data, sendAction);

                case Actions.Types.DECRYPT_MESSAGE:
                        const decryptAction = <Actions.DecryptMessage><any>action;
                        return handleDecryptMessage(data, decryptAction);

                case Actions.Types.SET_PLAYER_KEY:
                        const setPlayerKey = <Actions.SetPlayerKey><any>action;
                        return handleSetPlayerKey(data, setPlayerKey);

                case Actions.Types.GENERATED_KEY:
                        const generatedKey = <Actions.GeneratedKey><any>action;
                        return handleGeneratedKey(data, generatedKey);

                case Actions.Types.IMPORT_KEYS:
                        const importKeys = <Actions.ImportKeys><any>action;
                        return handleImportKeys(data, importKeys);

                case Actions.Types.TICK:
                        const tick = <Actions.Tick><any>action;
                        return handleTick(data, tick);

                case Actions.Types.FASTFORWARD:
                        const fastforward = <Actions.Fastforward><any>action;
                        return handleFastforward(data, fastforward);

                case Actions.Types.REWIND:
                        const rewind = <Actions.Rewind><any>action;
                        return handleRewind(data, rewind);

                default:
                        return data;
        }
}

function handleDisplayMessage (data: Data.Data, action: Actions.DisplayMessage)
{
        const messageId = action.parameters;
        const message = data.messagesById[messageId];
        const newMessage = Message.markRead(message, true);
        return Data.updateMessage(data, newMessage);
}

function handleReceiveReply (data: Data.Data, action: Actions.ReceiveReply)
{
        const reply = action.parameters;
        const message = Message.createMessage(reply, reply.id);
        return Data.storeMessage(data, message, 'inbox');
}

function handleSendMessage (data: Data.Data, action: Actions.SendMessage)
{
        const parameters = action.parameters;
        const message = parameters.message;
        const messageId = message.id;
        const parentId = parameters.parentId;

        let tempData = data;

        const parent = data.messagesById[parentId];
        if (parent) {
                const newParent = Message.markReplied(parent, true);
                tempData = Data.updateMessage(tempData, newParent);
        }

        return Data.storeMessage(tempData, message, 'sent');
}

function handleDecryptMessage (data: Data.Data, action: Actions.DecryptMessage)
{
        const parameters = action.parameters;
        const messageId = parameters.messageId;
        const body = parameters.decryptedBody;
        const message = data.messagesById[messageId];
        const newMessage = Helpers.assign(message, { body });
        return Data.updateMessage(data, newMessage);
}

function handleSetPlayerKey (data: Data.Data, action: Actions.SetPlayerKey)
{
        const activeKeyId = action.parameters;
        const keyManager = data.keyManagersById[activeKeyId];
        if (keyManager.has_pgp_private()) {
                const player = Helpers.assign(data.player, { activeKeyId });
                return Helpers.assign(data, { player });
        } else {
                return data;
        }
}

function handleGeneratedKey (data: Data.Data, action: Actions.GeneratedKey)
{
        const parameters = action.parameters;
        const id = parameters.id;
        const keyManager = parameters.keyManager;
        return Data.storeKeyManager(data, id, keyManager);
}

function handleImportKeys (data: Data.Data, action: Actions.ImportKeys)
{
        const newKeyManagersById = action.parameters;
        const keyManagersById = Map.merge(
                data.keyManagersById, newKeyManagersById);
        const keyManagers = Map.keys(keyManagersById);
        return Helpers.assign(data, { keyManagersById, keyManagers });
}

function handleTick (data: Data.Data, action: Actions.Tick)
{
        const clock = Clock.tick(data.clock);
        return Helpers.assign(data, { clock });
}

function handleFastforward (data: Data.Data, action: Actions.Fastforward)
{
        const clock = Clock.fastforward(data.clock);
        return Helpers.assign(data, { clock });
}

function handleRewind (data: Data.Data, action: Actions.Rewind)
{
        const clock = Clock.rewind(data.clock);
        return Helpers.assign(data, { clock });
}
