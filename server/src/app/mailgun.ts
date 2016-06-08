/// <reference path='../../../typings/mailgun-js/mailgun-js.d.ts'/>

import Log = require('./../../../core/src/app/log');
import Message = require('./../../../core/src/app/message');
import Request = require('./../../../core/src/app/requesttypes');

import MailgunModule = require('mailgun-js');

export function createMailgun (key: string, domain: string): any
{
        return MailgunModule({apiKey: key, domain: domain});
}

export function sendMail (mailgun: any, data: Message.MessageData)
{
        const mailgunData = {
                from: data.from,
                to: data.to,
                subject: data.subject,
                text: data.body,
                attachment: data.attachment,
        };

        return new Promise<string>((resolve, reject) => {
                mailgun.messages().send(mailgunData,
                        (err: any, body: { id: string; }) => {
                                if (err) {
                                        Log.debug('Mailgun send error', err);

                                        Log.metric({
                                                type: 'MESSAGE_NOT_SENT',
                                                playerEmail: data.from,
                                                error: err,
                                                message: {
                                                        name: data.name,
                                                        from: data.from,
                                                        to: data.to,
                                                        subject: data.subject,
                                                }
                                        });

                                        reject(err);
                                } else {
                                        const id = body.id;

                                        Log.metric({
                                                type: 'MESSAGE_SENT',
                                                playerEmail: data.from,
                                                message: {
                                                        name: data.name,
                                                        id,
                                                        from: data.from,
                                                        to: data.to,
                                                        subject: data.subject,
                                                }
                                        });

                                        resolve(id);
                                }
                        });
        })
}
