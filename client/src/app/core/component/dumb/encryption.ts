import EncryptionType = require('../../folder');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../../../../core/src/app/kbpgp');
import Map = require('../../../../../../core/src/app/utils/map');
import React = require('react');
import SelectableRows = require('./selectablerows');

interface EncryptionProps extends React.Props<any> {
        keyManagersById: Map.Map<Kbpgp.KeyManagerInstance>;
        activeId: string;
        selectedId: string;
}

function renderEncryption(props: EncryptionProps)
{
        const selectedId = props.selectedId;
        const activeId = props.activeId;
        const highlightedIds = [activeId];
        const keyManagersById = props.keyManagersById;
        const rowDataById = Map.map(keyManagersById,
                (instance, id) => createRowData(instance, id, activeId));
        return SelectableRows({ rowDataById, selectedId, highlightedIds });
}

const Encryption = React.createFactory(renderEncryption);

function createRowData (
        instance: Kbpgp.KeyManagerInstance, id: string, activeId: string)
{
        const status = id === activeId ? 'A' : ' ';
        const type = KbpgpHelpers.getDisplayType(instance);
        const userId = KbpgpHelpers.getUserId(instance);

        return [status, id, type, userId];
}

export = Encryption;
