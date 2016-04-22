import Message = require('./message');

export const Types = {
        INBOX: 'INBOX',
        SENT: 'SENT',
};

export interface FolderData {
        type: string;
        displayName: string;
        id: string;
        messages: Message.Message[];
};

export interface Folder {
        type: string;
        id: string;
        displayName: string;
};

export function createFolder (folderData: FolderData)
{
        return {
                type: folderData.type,
                id: folderData.id,
                displayName: folderData.displayName,
        };
}
