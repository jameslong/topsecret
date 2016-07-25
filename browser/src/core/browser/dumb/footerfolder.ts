import Folder = require('../../folder');
import Message = require('../../message');
import React = require('react');

import Core = require('../common/core');
import Div = Core.Div;
import Span = Core.Span;

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
                        Span({}, `${activeIndex}/${numFolders}`)),
                Div({ className: 'infobar-major' }, Span({}, folderName))
        );
}

const FooterFolder = React.createFactory(renderFooterFolder);

export = FooterFolder;
