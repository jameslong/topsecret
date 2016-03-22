/// <reference path='../../../typings/mailgun-js/mailgun-js.d.ts'/>

import Log = require('./../../../core/src/app/log');
import Message = require('./../../../core/src/app/message');
import Request = require('./../../../core/src/app/requesttypes');

import MailgunModule = require('mailgun-js');

export function createMailgun (key: string, domain: string): any
{
        return MailgunModule({apiKey: key, domain: domain});
}

export function sendMail (mailgun: any, messageData: Message.MessageData)
{
        const mailgunMessageData = {
                from: messageData.from,
                to: messageData.to,
                subject: messageData.subject,
                text: messageData.body,
        };

        return new Promise<string>((resolve, reject) => {
                mailgun.messages().send(mailgunMessageData,
                        (err: any, body: { id: string; }) => {
                                if (err) {
                                        Log.debug('Mailgun send error', err);
                                        reject(err);
                                } else {
                                        const id = (body ? body.id : null);
                                        resolve(id);
                                }
                        });
        })
}
