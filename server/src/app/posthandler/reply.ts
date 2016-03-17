import App = require('../app');
import Careers = require('./careers');
import Log = require('../../../../core/src/app/log/log');
import PromisesReply = require('../../../../core/src/app/promisesreply');

export function handleReplyRequest (
        state: App.State,
        email: string,
        id: string,
        subject: string,
        body: string,
        to: string)
{
        const careersEmail = Careers.isCareersEmail(to);

        const reply = {
                from: email,
                to: to,
                subject: subject,
                body: body,
                id: id,
        };
        const timestampMs = Date.now();

        Log.info('replyReceived', {
                        from: email,
                        to: to,
                        subject: subject,
                        body: body,
                });

        if (careersEmail) {
                return Careers.handleCareersEmail(state, reply);
        } else {
                const app = state.app;
                const { data, promises } = app;
                return PromisesReply.handleReplyMessage(
                        reply,
                        timestampMs,
                        data,
                        promises);
        }
}
