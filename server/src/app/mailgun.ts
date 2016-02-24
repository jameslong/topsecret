/// <reference path='../../../typings/mailgun-js/mailgun-js.d.ts'/>

import Log = require('./../../../game/log/log');
import Message = require('./../../../game/message');
import Request = require('./../../../game/requesttypes');

import MailgunModule = require('mailgun-js');

export function createMailgun (key: string, domain: string): any
{
        return MailgunModule({apiKey: key, domain: domain});
}

export function sendMail (
        mailgun: any,
        messageData: Message.MessageData,
        callback: Request.Callback<string>)
{
        var to = [messageData.playerEmail].concat(messageData.to);

        var mailgunMessageData = {
                from: messageData.from,
                to: to,
                subject: messageData.subject,
                text: messageData.body,
        };

        var onError = function (error: any, body: {id: string;})
                {
                        if (error) {
                                Log.debug('Mailgun send error', error);
                        }

                        var id = (body ? body.id : null);
                        callback(error, id);
                }

        mailgun.messages().send(mailgunMessageData, onError);
}
