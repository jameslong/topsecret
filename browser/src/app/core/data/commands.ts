import Command = require('../command');
import Data = require('../data');
import KeyHandlers = require('../action/keyhandlers');
import UI = require('../ui');

const KeyCodes = {
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        G: 71,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        O: 79,
        R: 82,
        S: 83,
        T: 84,
        Y: 89,
        RETURN: 13,
        ESCAPE: 27,
        UP: 38,
        DOWN: 40,
        QUESTIONMARK: 191,
        MINUS: 189,
        PLUS: 187,
}

const commonCommands: Command.Command[] = [{
        id: 'exit',
        key: 'i',
        keyCodes: [KeyCodes.I],
        actionCreator: KeyHandlers.exit,
        shortDesc: 'Exit',
        desc: 'return to index',
}, {
        id: 'open-main-menu',
        key: 'esc',
        keyCodes: [KeyCodes.ESCAPE],
        actionCreator: KeyHandlers.openMainMenu,
        shortDesc: '',
        desc: 'view main menu',
}, {
        id: 'next-message',
        key: 'j',
        keyCodes: [KeyCodes.J, KeyCodes.DOWN],
        actionCreator: KeyHandlers.nextMessage,
        shortDesc: 'Next',
        desc: 'view next message',
}, {
        id: 'previous-message',
        key: 'k',
        keyCodes: [KeyCodes.K, KeyCodes.UP],
        actionCreator: KeyHandlers.previousMessage,
        shortDesc: 'Previous',
        desc: 'view previous message',
}, {
        id: 'mail',
        key: 'm',
        keyCodes: [KeyCodes.M],
        actionCreator: KeyHandlers.mail,
        shortDesc: 'Mail',
        desc: 'compose new message',
}, {
        id: 'decrypt',
        key: 'd',
        keyCodes: [KeyCodes.D],
        actionCreator: KeyHandlers.decrypt,
        shortDesc: 'Decrypt',
        desc: 'decrypt message',
}, {
        id: 'reply',
        key: 'r',
        keyCodes: [KeyCodes.R],
        actionCreator: KeyHandlers.reply,
        shortDesc: 'Reply',
        desc: 'reply to message',
}, {
        id: 'change',
        key: 'c',
        keyCodes: [KeyCodes.C],
        actionCreator: KeyHandlers.folder,
        shortDesc: 'Change Mailbox',
        desc: 'change the mailbox',
}, {
        id: 'open-help',
        key: '?',
        keyCodes: [KeyCodes.QUESTIONMARK],
        actionCreator: KeyHandlers.help,
        shortDesc: 'Help',
        desc: 'display available commands',
}, {
        id: 'tick-faster',
        key: '+',
        keyCodes: [KeyCodes.PLUS],
        actionCreator: KeyHandlers.tickFaster,
        shortDesc: '',
        desc: 'speed up time',
}, {
        id: 'tick-slower',
        key: '-',
        keyCodes: [KeyCodes.MINUS],
        actionCreator: KeyHandlers.tickSlower,
        shortDesc: '',
        desc: 'slow down time',
}, {
        id: 'add-time-offset',
        key: 'o',
        keyCodes: [KeyCodes.O],
        actionCreator: KeyHandlers.addTimeOffset,
        shortDesc: '',
        desc: 'move 6 hours ahead of present',
}];

const composeCommands = [, {
        id: 'send-message',
        key: 'y',
        keyCodes: [KeyCodes.Y],
        actionCreator: KeyHandlers.encryptSend,
        shortDesc: 'Send',
        desc: 'send message',
}, {
        id: 'edit-subject',
        key: 's',
        keyCodes: [KeyCodes.S],
        actionCreator: KeyHandlers.editSubject,
        shortDesc: 'Subject',
        desc: 'edit message subject',
}, {
        id: 'edit-to',
        key: 't',
        keyCodes: [KeyCodes.T],
        actionCreator: KeyHandlers.editTo,
        shortDesc: 'To',
        desc: 'edit message recipient(s)',
}, {
        id: 'edit-body',
        key: 'e',
        keyCodes: [KeyCodes.E],
        actionCreator: KeyHandlers.editBody,
        shortDesc: 'Body',
        desc: 'edit message body',
}];

const composeBodyCommands = [{
        id: 'end-edit-body',
        key: 'ESC',
        keyCodes: [KeyCodes.ESCAPE],
        actionCreator: KeyHandlers.endEditBody,
        shortDesc: 'Finish Editing',
        desc: 'finish editing message body',
}];

const encryptionCommands = [{
        id: 'set-player-key',
        key: '<Return>',
        keyCodes: [KeyCodes.RETURN],
        actionCreator: KeyHandlers.setPlayerKey,
        shortDesc: 'Set active',
        desc: 'set active encryption key',
}, {
        id: 'next-key',
        key: 'j',
        keyCodes: [KeyCodes.J, KeyCodes.DOWN],
        actionCreator: KeyHandlers.nextKey,
        shortDesc: 'Next',
        desc: 'view next key',
}, {
        id: 'previous-key',
        key: 'k',
        keyCodes: [KeyCodes.K, KeyCodes.UP],
        actionCreator: KeyHandlers.previousKey,
        shortDesc: 'Previous',
        desc: 'view previous key',
}, {
        id: 'start-generate-key',
        key: 'g',
        keyCodes: [KeyCodes.G],
        actionCreator: KeyHandlers.startGenerateKey,
        shortDesc: 'Generate',
        desc: 'generate new PGP key',
}, {
        id: 'delete-key',
        key: 'd',
        keyCodes: [KeyCodes.D],
        actionCreator: KeyHandlers.deleteKey,
        shortDesc: 'Delete',
        desc: 'delete key',
}];

const folderCommands = [{
        id: 'display-mailbox',
        key: '<Return>',
        keyCodes: [KeyCodes.RETURN],
        actionCreator: KeyHandlers.displayFolder,
        shortDesc: 'Display',
        desc: 'display mailbox',
}, {
        id: 'next-mailbox',
        key: 'j',
        keyCodes: [KeyCodes.J, KeyCodes.DOWN],
        actionCreator: KeyHandlers.nextFolder,
        shortDesc: 'Next',
        desc: 'view next mailbox',
}, {
        id: 'previous-mailbox',
        key: 'k',
        keyCodes: [KeyCodes.K, KeyCodes.UP],
        actionCreator: KeyHandlers.previousFolder,
        shortDesc: 'Previous',
        desc: 'view previous mailbox',
}];

const helpCommands = [{
        id: 'exit-help',
        key: 'i',
        keyCodes: [KeyCodes.I],
        actionCreator: KeyHandlers.exitHelp,
        shortDesc: 'Exit',
        desc: 'return to index',
}];

const indexCommands: Command.Command[] = [{
        id: 'display-message',
        key: '<Return>',
        keyCodes: [KeyCodes.RETURN],
        actionCreator: KeyHandlers.displayMessage,
        shortDesc: 'Display',
        desc: 'display message',
}, {
        id: 'encryption',
        key: 'b',
        keyCodes: [KeyCodes.B],
        actionCreator: KeyHandlers.encryption,
        shortDesc: 'Keys',
        desc: 'view and generate encryption keys',
}];

const loadCommands = [{
        id: 'exit-load',
        key: 'i',
        keyCodes: [KeyCodes.I],
        actionCreator: KeyHandlers.exitLoad,
        shortDesc: 'Exit',
        desc: 'return to main menu',
}, {
        id: 'load',
        key: '<Return>',
        keyCodes: [KeyCodes.RETURN],
        actionCreator: KeyHandlers.load,
        shortDesc: 'Load',
        desc: 'load selected save',
}, {
        id: 'next-load',
        key: 'j',
        keyCodes: [KeyCodes.J, KeyCodes.DOWN],
        actionCreator: KeyHandlers.nextLoad,
        shortDesc: 'Next',
        desc: 'select next load file',
}, {
        id: 'previous-load',
        key: 'k',
        keyCodes: [KeyCodes.K, KeyCodes.UP],
        actionCreator: KeyHandlers.previousLoad,
        shortDesc: 'Previous',
        desc: 'select previous load file',
}, {
        id: 'delete-save',
        key: 'd',
        keyCodes: [KeyCodes.D],
        actionCreator: KeyHandlers.deleteSave,
        shortDesc: 'Delete',
        desc: 'delete save data',
}];

const menuCommands = [{
        id: 'exit-main-menu',
        key: 'i',
        keyCodes: [KeyCodes.I],
        actionCreator: KeyHandlers.exitMainMenu,
        shortDesc: 'Exit',
        desc: 'exit main menu',
}, {
        id: 'next-menu-option',
        key: 'j',
        keyCodes: [KeyCodes.J, KeyCodes.DOWN],
        actionCreator: KeyHandlers.nextMenuOption,
        shortDesc: 'Next',
        desc: 'select next option',
}, {
        id: 'previous-menu-option',
        key: 'k',
        keyCodes: [KeyCodes.K, KeyCodes.UP],
        actionCreator: KeyHandlers.previousMenuOption,
        shortDesc: 'Previous',
        desc: 'select previous option',
}, {
        id: 'select-menu-option',
        key: '<Return>',
        keyCodes: [KeyCodes.RETURN],
        actionCreator: KeyHandlers.selectMenuOption,
        shortDesc: 'Select',
        desc: 'select menu option',
}];

const pagerCommands = [{
        id: 'exit-pager',
        key: 'i',
        keyCodes: [KeyCodes.I],
        actionCreator: KeyHandlers.exit,
        shortDesc: 'Exit',
        desc: 'return to index',
}, {
        id: 'display-next-message',
        key: 'j',
        keyCodes: [KeyCodes.J, KeyCodes.DOWN],
        actionCreator: KeyHandlers.displayNextMessage,
        shortDesc: 'Next',
        desc: 'view next message',
}, {
        id: 'display-previous-message',
        key: 'k',
        keyCodes: [KeyCodes.K, KeyCodes.UP],
        actionCreator: KeyHandlers.displayPreviousMessage,
        shortDesc: 'Previous',
        desc: 'view previous message',
}, {
        id: 'import-keys',
        key: 'l',
        keyCodes: [KeyCodes.L],
        actionCreator: KeyHandlers.importKeys,
        shortDesc: 'Import keys',
        desc: 'import PGP keys from message',
}];

const saveCommands = [{
        id: 'exit-save',
        key: 'i',
        keyCodes: [KeyCodes.I],
        actionCreator: KeyHandlers.exitSave,
        shortDesc: 'Exit',
        desc: 'return to main menu',
}, {
        id: 'save',
        key: '<Return>',
        keyCodes: [KeyCodes.RETURN],
        actionCreator: KeyHandlers.save,
        shortDesc: 'Save',
        desc: 'save as',
}, {
        id: 'next-save',
        key: 'j',
        keyCodes: [KeyCodes.J, KeyCodes.DOWN],
        actionCreator: KeyHandlers.nextSave,
        shortDesc: 'Next',
        desc: 'select next save',
}, {
        id: 'previous-save',
        key: 'k',
        keyCodes: [KeyCodes.K, KeyCodes.UP],
        actionCreator: KeyHandlers.previousSave,
        shortDesc: 'Previous',
        desc: 'select previous save',
}, {
        id: 'delete-save',
        key: 'd',
        keyCodes: [KeyCodes.D],
        actionCreator: KeyHandlers.deleteSave,
        shortDesc: 'Delete',
        desc: 'delete save data',
}];

export const commands = [].concat(
        commonCommands,
        composeCommands,
        composeBodyCommands,
        encryptionCommands,
        folderCommands,
        helpCommands,
        indexCommands,
        loadCommands,
        menuCommands,
        pagerCommands,
        saveCommands);

export const commandIdsByMode: Data.IdsById = {
        [UI.Modes.COMPOSE]: [
                'exit',
                'send-message',
                'edit-subject',
                'edit-to',
                'edit-body',
                'open-main-menu',
                'open-help'
        ],
        [UI.Modes.COMPOSE_BODY]: [
                'end-edit-body'
        ],
        [UI.Modes.ENCRYPTION]: [
                'exit',
                'set-player-key',
                'next-key',
                'previous-key',
                'start-generate-key',
                'delete-key',
                'open-main-menu',
                'open-help'
        ],
        [UI.Modes.FOLDER]: [
                'next-mailbox',
                'previous-mailbox',
                'display-mailbox',
                'open-main-menu',
                'open-help'
        ],
        [UI.Modes.HELP]: ['exit-help'],
        [UI.Modes.INDEX_INBOX]: [
                'next-message',
                'previous-message',
                'display-message',
                'mail',
                'reply',
                'change',
                'encryption',
                'open-help',
                'tick-faster',
                'tick-slower',
                'add-time-offset',
                'open-main-menu'
        ],
        [UI.Modes.INDEX_SENT]: [
                'next-message',
                'previous-message',
                'display-message',
                'mail',
                'change',
                'encryption',
                'open-main-menu',
                'open-help'
        ],
        [UI.Modes.LOAD_MENU]: [
                'exit-load',
                'load',
                'next-load',
                'previous-load',
                'delete-save'
        ],
        [UI.Modes.MAIN_MENU]: [
                'exit-main-menu',
                'select-menu-option',
                'next-menu-option',
                'previous-menu-option'
        ],
        [UI.Modes.PAGER]: [
                'exit-pager',
                'display-next-message',
                'display-previous-message',
                'mail',
                'reply',
                'decrypt',
                'import-keys',
                'change',
                'open-main-menu',
                'open-help'
        ],
        [UI.Modes.SAVE_MENU]: [
                'exit-save',
                'save',
                'next-save',
                'previous-save',
                'delete-save'
        ],
}
