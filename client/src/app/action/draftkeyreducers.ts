import Actions = require('./actions');
import Helpers = require('../utils/helpers');
import Kbpgp = require('../kbpgp');
import Redux = require('../redux/redux');

export function draftKey (draftKey: Kbpgp.KeyData, action: Redux.Action<any>)
{
        switch (action.type) {
                case Actions.Types.START_GENERATE_KEY:
                        const startGenerateKey = <Actions.StartGenerateKey><any>action;
                        return handleStartGenerateKey(draftKey, startGenerateKey);

                case Actions.Types.SET_DRAFT_KEY_NAME:
                        const setKeyName = <Actions.SetDraftKeyName><any>action;
                        return handleSetDraftKeyName(draftKey, setKeyName);

                case Actions.Types.SET_DRAFT_KEY_PASSPHRASE:
                        const setKeyPassphrase = <Actions.SetDraftKeyPassphrase><any>action;
                        return handleSetDraftKeyPassphrase(draftKey, setKeyPassphrase);

                default:
                        return draftKey;
        }
}

function handleStartGenerateKey (
        draftKey: Kbpgp.KeyData, action: Actions.StartGenerateKey)
{
        const newDraft = Kbpgp.createKeyData();
        return Helpers.assign(draftKey, newDraft);
}

function handleSetDraftKeyName (
        draftKey: Kbpgp.KeyData, action: Actions.SetDraftKeyName)
{
        const id = action.parameters;
        return Helpers.assign(draftKey, { id });
}

function handleSetDraftKeyPassphrase (
        draftKey: Kbpgp.KeyData, action: Actions.SetDraftKeyPassphrase)
{
        const passphrase = action.parameters;
        return Helpers.assign(draftKey, { passphrase });
}
