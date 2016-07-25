import EncryptionType = require('../../../folder');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../../../../core/src/kbpgp');
import Helpers = require('../../../../../../core/src/utils/helpers');
import Map = require('../../../../../../core/src/utils/map');
import Player = require('../../../player');
import Profile = require('../../../../../../core/src/profile');
import React = require('react');
import SelectableRows = require('../../common/selectablerows');

interface EncryptionProps extends React.Props<any> {
        knownKeyIds: string[];
        profilesById: Map.Map<Profile.Profile>;
        selectedIndex: number;
}

function renderEncryption(props: EncryptionProps)
{
        const { knownKeyIds, profilesById, selectedIndex } = props;
        const highlightedIndices: number[] = [];
        const rowData = knownKeyIds.map(id => {
                const profile = profilesById[id];
                const type = 'public';
                return [profile.name, type, profile.email];
        });
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const Encryption = React.createFactory(renderEncryption);

function createRowData (
        name: string, email: string, isPrivate: boolean)
{
        const type = isPrivate ? 'public/private' : 'public';
        return [name, type, email];
}

export = Encryption;
