import Folder = require('../../folder');
import Message = require('../../message');
import React = require('react');

import Core = require('../core');
import Div = Core.Div;

interface FooterFolderProps extends React.Props<any> {
        activeFolder: Folder.Folder;
        folders: string[];
}

function renderFooterFolder(props: FooterFolderProps)
{
        const folders = props.folders;
        const activeFolder = props.activeFolder;
        const numFolders = folders.length;
        const activeIndex = folders.indexOf(activeFolder.id) + 1;
        const folderName = activeFolder.displayName;
        return Div({},
                Div({ className: 'infobar-major' },
                        `${activeIndex}/${numFolders}`),
                Div({ className: 'infobar-major' }, folderName)
        );
}

const FooterFolder = React.createFactory(renderFooterFolder);

export = FooterFolder;
