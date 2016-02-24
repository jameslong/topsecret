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
        R: 82,
        S: 83,
        T: 84,
        Y: 89,
        RETURN: 13,
        ESCAPE: 27,
        UP: 38,
        DOWN: 40,
        QUESTIONMARK: 191,
}

const commonCommands: Command.Command[] = [{
        id: 'exit',
        key: 'i',
        keyCodes: [KeyCodes.I],
        actionCreator: KeyHandlers.exit,
        shortDesc: 'Exit',
        desc: 'return to index',
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

export const commands = [].concat(
        commonCommands,
        composeCommands,
        encryptionCommands,
        folderCommands,
        helpCommands,
        indexCommands,
        pagerCommands);

export const commandIdsByMode: Data.IdsById = {
        [UI.Modes.COMPOSE]: [
                'exit',
                'send-message',
                'edit-subject',
                'edit-to',
                'edit-body',
                'open-help'
        ],
        [UI.Modes.ENCRYPTION]: [
                'exit',
                'set-player-key',
                'next-key',
                'previous-key',
                'start-generate-key',
                'delete-key',
                'open-help'
        ],
        [UI.Modes.FOLDER]: [
                'next-mailbox',
                'previous-mailbox',
                'display-mailbox',
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
                'open-help'
        ],
        [UI.Modes.INDEX_SENT]: [
                'next-message',
                'previous-message',
                'display-message',
                'mail',
                'change',
                'encryption',
                'open-help'
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
                'open-help'
        ],
}
