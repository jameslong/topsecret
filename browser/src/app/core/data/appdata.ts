import Command = require('../command');
import Folder = require('../folder');
import Map = require('../../../../../core/src/app/utils/map');
import Menu = require('../menu');

export interface AppData {
        commands: Command.Command[];
        commandIdsByMode: Map.Map<string[]>;
        menuItems: Menu.Item[];
        folders: Folder.FolderData[];
}
