import Actions = require('../actions/actions');
import Draft = require('../draft');
import Helpers = require('../../../../core/src/utils/helpers');
import Message = require('../message');
import Redux = require('../redux/redux');

export function draft (draft: Draft.Draft, action: Redux.Action<any>)
{
        switch (action.type) {
                case Actions.Types.COMPOSE_MESSAGE:
                        const composeMessage = <Actions.ComposeMessage><any>action;
                        return handleComposeMessage(draft, composeMessage);

                case Actions.Types.COMPOSE_REPLY:
                        const composeReply = <Actions.ComposeReply><any>action;
                        return handleComposeReply(draft, composeReply);

                case Actions.Types.SET_DRAFT_BODY:
                        const setBody = <Actions.SetDraftBody><any>action;
                        return handleSetDraftBody(draft, setBody);

                case Actions.Types.SET_DRAFT_SUBJECT:
                        const setSubject = <Actions.SetDraftSubject><any>action;
                        return handleSetDraftSubject(draft, setSubject);

                case Actions.Types.SET_DRAFT_TO:
                        const setTo = <Actions.SetDraftTo><any>action;
                        return handleSetDraftTo(draft, setTo);

                default:
                        return draft;
        }
}

function handleComposeMessage (draft: Draft.Draft, action: Actions.ComposeMessage)
{
        const parameters = action.parameters;
        const sender = parameters.sender;
        const message = Message.createMessageContent(sender);
        return Draft.createDraft(message, null);
}

function handleComposeReply (draft: Draft.Draft, action: Actions.ComposeReply)
{
        const parameters = action.parameters;
        const sender = parameters.sender;
        const message = parameters.message;
        return Draft.createDraftFromMessage(sender, message);
}

function handleSetDraftBody (draft: Draft.Draft, action: Actions.SetDraftBody)
{
        const body = action.parameters;
        const content = Helpers.assign(draft.content, { body });
        return Helpers.assign(draft, { content });
}

function handleSetDraftSubject (draft: Draft.Draft, action: Actions.SetDraftSubject)
{
        const subject = action.parameters;
        const content = Helpers.assign(draft.content, { subject });
        return Helpers.assign(draft, { content });
}

function handleSetDraftTo (draft: Draft.Draft, action: Actions.SetDraftTo)
{
        const to = action.parameters;
        const content = Helpers.assign(draft.content, { to });
        return Helpers.assign(draft, { content });
}
