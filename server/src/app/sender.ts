import Mailgun = require('./mailgun');
import Message = require('./../../../core/src/app/message');
import Prom = require('./../../../core/src/app/utils/promise');
import Request = require('./../../../core/src/app/requesttypes');
import Server = require('./server');

export function createSendFn (
        io: any,
        useEmail: boolean,
        emailAPIKey: string,
        emailDomain: string): Prom.Factory<Message.MessageData, string>
{
        var mailgun = Mailgun.createMailgun(emailAPIKey, emailDomain);
        return useEmail ?
                (data: Message.MessageData) => new Promise((resolve, reject) =>
                        Mailgun.sendMail(mailgun, data, (err, messageId) =>
                                err ? reject(err) : resolve(messageId))) :
                (data: Message.MessageData) => new Promise((resolve, reject) =>
                        Server.sendMail(io, data, (err, messageId) =>
                                err ? reject(err) : resolve(messageId)));
}
