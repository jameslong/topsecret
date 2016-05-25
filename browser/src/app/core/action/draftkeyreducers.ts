import Actions = require('./actions');
import Helpers = require('../../../../../core/src/app/utils/helpers');
import Kbpgp = require('../../../../../core/src/app/kbpgp');
import Redux = require('../redux/redux');

export function draftKey (draftKey: Kbpgp.KeyData, action: Redux.Action<any>)
{
        switch (action.type) {
                default:
                        return draftKey;
        }
}
