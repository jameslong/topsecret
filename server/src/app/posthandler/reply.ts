import App = require('../app');
import Careers = require('./careers');
import Log = require('../../../../core/src/app/log');
import Message = require('../../../../core/src/app/message');
import PromisesReply = require('../../../../core/src/app/promisesreply');

export function handleReplyRequest (state: App.State, reply: Message.Reply)
{
        const careersEmail = Careers.isCareersEmail(reply.to);
        const timestampMs = Date.now();

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
