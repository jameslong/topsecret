declare module "mailgun-js" {
        interface MessageData {
                from: string;
                to: string[];
                subject: string;
                text: string;
        }

        type SendCallback = (error: Error, body: string) => void;

        interface Messages {
                send(data: MessageData, callback: SendCallback): void;
        }

        interface Mailgun {
                messages(): Messages;
        }

        function createMailgun(params: { apiKey: string; domain: string; }): Mailgun;
        export = createMailgun;
}
