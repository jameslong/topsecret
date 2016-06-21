/// <reference path='../../../typings/mailgun-js/mailgun-js.d.ts'/>

import Log = require('./../../../core/src/app/log');
import Message = require('./../../../core/src/app/message');
import Request = require('./../../../core/src/app/requesttypes');
import Str = require('./../../../core/src/app/utils/string');

import MailgunModule = require('mailgun-js');

export function createMailgun (key: string, domain: string): any
{
        return MailgunModule({apiKey: key, domain: domain});
}

export function sendMail (
        mailgun: any,
        htmlFooter: string,
        textFooter: string,
        data: Message.MessageData)
{
        const body = data.body;
        const text = `${body}${textFooter}`;

        const ps = Str.split(body, '\n\n', text => `<p>${text}</p>`);
        const elements = ps.map(text => text.replace('\n', '<br>'));
        const elementsString = elements.join('');
        const html = `<div>${elementsString}${htmlFooter}</div>`;

        const mailgunData = {
                from: data.from,
                to: data.to,
                subject: data.subject,
                text,
                html,
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
