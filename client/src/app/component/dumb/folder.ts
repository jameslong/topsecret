import FolderType = require('../../folder');
import Map = require('../../map/map');
import React = require('react');
import SelectableRows = require('./selectablerows');

interface FolderProps extends React.Props<any> {
        foldersById: Map.Map<FolderType.Folder>;
        activeFolderId: string;
}

function renderFolder(props: FolderProps)
{
        const selectedId = props.activeFolderId;
        const highlightedIds: string[] = [];
        const foldersById = props.foldersById;
        const rowDataById = Map.map(foldersById,
                folder => [folder.displayName]);
        return SelectableRows({ rowDataById, selectedId, highlightedIds });
}

const Folder = React.createFactory(renderFolder);

export = Folder;
