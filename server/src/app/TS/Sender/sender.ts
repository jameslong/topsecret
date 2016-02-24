import Mailgun = require('../Mailgun/mailgun');
import Message = require('../game/message');
import Request = require('../game/requesttypes');
import Server = require('../Server/server');

export type SendFn = (
        data: Message.MessageData,
        callback: Request.Callback<string>)
        => void;

export function createSendFn (
        io: any,
        useEmail: boolean,
        emailAPIKey: string,
        emailDomain: string): SendFn
{
        var mailgun = Mailgun.createMailgun(emailAPIKey, emailDomain);
        return useEmail ?
                (data, onSend) => Mailgun.sendMail(mailgun, data, onSend) :
                (data, onSend) => Server.sendMail(io, data, onSend);
}
