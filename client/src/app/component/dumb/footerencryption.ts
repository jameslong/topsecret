import Kbpgp = require('kbpgp');
import React = require('react');
import Str = require('../../../../../core/src/app/utils/string');

import Core = require('../core');
import Div = Core.Div;

interface FooterEncryptionProps extends React.Props<any> {
        activeKey: Kbpgp.KeyManagerInstance;
}

function renderFooterEncryption(props: FooterEncryptionProps)
{
        const activeKey = props.activeKey;
        const fingerprint = activeKey ?
                activeKey.get_pgp_fingerprint_str().toUpperCase() :
                '';
        const splitFingerprint = fingerprint ?
                Str.splitIntoEqualGroups(fingerprint, 4) :
                '';
        return Div({}, `Fingerprint: ${splitFingerprint}`);
}

const FooterEncryption = React.createFactory(renderFooterEncryption);

export = FooterEncryption;
