import Actions = require('../actions/actions');
import Arr = require('../../../../core/src/utils/array');
import Clock = require('../../../../core/src/clock');
import Data = require('../data');
import Helpers = require('../../../../core/src/utils/helpers');
import Map = require('../../../../core/src/utils/map');
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

                case Actions.Types.IMPORT_KEYS:
                        const importKeys = <Actions.ImportKeys><any>action;
                        return handleImportKeys(data, importKeys);

                case Actions.Types.TICK:
                        const tick = <Actions.Tick><any>action;
                        return handleTick(data, tick);

                case Actions.Types.TICK_FASTER:
                        const tickFaster = <Actions.TickFaster><any>action;
                        return handleTickFaster(data, tickFaster);

                case Actions.Types.TICK_SLOWER:
                        const tickSlower = <Actions.TickSlower><any>action;
                        return handleTickSlower(data, tickSlower);

                case Actions.Types.ADD_TIME_OFFSET:
                        const addOffset = <Actions.AddTimeOffset><any>action;
                        return handleAddTimeOffset(data, addOffset);

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
        const timestampMs = Clock.gameTimeMs(data.clock);
        const clock = Clock.tickSlower(data.clock);
        const message = Message.createMessage(reply, reply.id, timestampMs);
        const newData = Data.storeMessage(data, message, 'inbox');
        return Helpers.assign(newData, { clock });
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

function handleImportKeys (data: Data.Data, action: Actions.ImportKeys)
{
        const newKeyIds = action.parameters;
        const keyIds = data.knownKeyIds.concat(newKeyIds);
        const knownKeyIds = Arr.unique(keyIds);
        return Helpers.assign(data, { knownKeyIds });
}

function handleTick (data: Data.Data, action: Actions.Tick)
{
        const clock = Clock.tick(data.clock);
        return Helpers.assign(data, { clock });
}

function handleTickFaster (data: Data.Data, action: Actions.TickFaster)
{
        const clock = Clock.tickFaster(data.clock);
        return Helpers.assign(data, { clock });
}

function handleTickSlower (data: Data.Data, action: Actions.TickSlower)
{
        const clock = Clock.tickSlower(data.clock);
        return Helpers.assign(data, { clock });
}

function handleAddTimeOffset (data: Data.Data, action: Actions.AddTimeOffset)
{
        const clock = Clock.addOffset(data.clock, action.parameters);
        return Helpers.assign(data, { clock });
}
