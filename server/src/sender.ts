import Mailgun = require('./mailgun');
import Message = require('./../../core/src/app/message');
import Prom = require('./../../core/src/app/utils/promise');
import Request = require('./../../core/src/app/requesttypes');
import Server = require('./server');

export function createSendFn (
        io: any,
        useEmail: boolean,
        htmlFooter: string,
        textFooter: string,
        emailAPIKey: string,
        emailDomain: string)
{
        var mailgun = Mailgun.createMailgun(emailAPIKey, emailDomain);
        return (data: Message.MessageData) =>
                useEmail ?
                        Mailgun.sendMail(mailgun, htmlFooter, textFooter, data) :
                        Server.sendMail(io, data);
}
