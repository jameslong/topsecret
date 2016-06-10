import Command = require('../command');
import Folder = require('../folder');
import Map = require('../../../../../core/src/app/utils/map');

export interface AppData {
        commands: Command.Command[];
        commandIdsByMode: Map.Map<string[]>;
        folders: Folder.FolderData[];
}
