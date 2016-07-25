import FolderType = require('../../../folder');
import Map = require('../../../../../../core/src/utils/map');
import React = require('react');
import SelectableRows = require('../../common/selectablerows');

interface FolderProps extends React.Props<any> {
        foldersById: Map.Map<FolderType.Folder>;
        activeFolderId: string;
}

function renderFolder(props: FolderProps)
{
        const { foldersById, activeFolderId } = props;
        const folderIds = Object.keys(foldersById);
        const selectedIndex = folderIds.indexOf(activeFolderId);
        const highlightedIndices: number[] = [];
        const rowData = folderIds.map(id => [foldersById[id].displayName]);
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const Folder = React.createFactory(renderFolder);

export = Folder;
