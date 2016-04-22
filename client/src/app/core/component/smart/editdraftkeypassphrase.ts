import ActionCreators = require('../../action/actioncreators');
import EditBar = require('../dumb/editbar');
import Kbpgp = require('../../../../../../core/src/app/kbpgp');
import React = require('react');
import Redux = require('../../redux/redux');

interface EditDraftKeyPassphraseProps extends React.Props<any> {
        value: string;
        userId: string;
        keyId: string;
}

function renderEditDraftKeyPassphrase(props: EditDraftKeyPassphraseProps)
{
        const value = props.value;
        const userId = props.userId;
        const keyId = props.keyId;

        return EditBar({
                placeholder: '',
                defaultValue: value,
                label: 'Passphrase',
                onChange: (e: KeyboardEvent, passphrase: string) =>
                        onChange(userId, keyId, e, passphrase),
        });
}

const EditDraftKeyPassphrase = React.createFactory(renderEditDraftKeyPassphrase);

function onChange (
        userId: string, keyId: string, e: KeyboardEvent, passphrase: string)
{
        e.stopPropagation();

        Kbpgp.generateKeyPair(userId).then(keyManager => {
                const action = ActionCreators.generatedKey({
                        id: keyId,
                        keyManager,
                });
                Redux.handleAction(action);
        }).catch(err => console.log(err));

        const action = ActionCreators.setDraftKeyPassphrase(passphrase);
        Redux.handleAction(action);
}

export = EditDraftKeyPassphrase;
