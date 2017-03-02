/// <reference path='../../typings/mailgun-js/mailgun-js.d.ts'/>

import Log = require('./../../core/src/log');
import Message = require('./../../core/src/message');
import Str = require('./../../core/src/utils/string');

import MailgunModule = require('mailgun-js');

export function createMailgun (key: string, domain: string): any
{
        return MailgunModule({apiKey: key, domain: domain});
}

function toHTML (text: string) {
        const ps = text.split('\n\n');
        const contents = ps.map(text => text.split('\n'));
        const inner = contents.map(p => {
                const brs = p.join('<br>');
                return `<p>${brs}</p>`;
        });
        return inner.join('');
}

export function sendMail (
        mailgun: any,
        htmlFooter: string,
        textFooter: string,
        data: Message.MessageData)
{
        const body = data.body;
        const text = `${body}${textFooter}`;

        const htmlBody = toHTML(body);
        const html = `<div>${htmlBody}${htmlFooter}</div>`;

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
