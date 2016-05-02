import Helpers = require('../../../../core/src/app/utils/helpers');

export const Modes = {
        INDEX_INBOX: 'INDEX_INBOX',
        INDEX_SENT: 'INDEX_SENT',
        HELP: 'HELP',
        PAGER: 'PAGER',
        COMPOSE: 'COMPOSE',
        ENCRYPTION: 'ENCRYPTION',
        FOLDER: 'FOLDER',
        MAIN_MENU: 'MAIN_MENU',
}

export interface UI {
        mode: string;
        previousMode: string;
        activeMessageId: string;
        activeFolderId: string;
        activeKeyId: string;
        activeMainMenuIndex: number;
        editingDraftBody: boolean;
        editingDraftSubject: boolean;
        editingDraftTo: boolean;
        editingDraftKeyName: boolean;
        editingDraftKeyPassphrase: boolean;
        sending: boolean;
        decrypting: boolean;
        generatingKey: boolean;
}

export function createUI (
        mode: string,
        activeMessageId: string,
        activeFolderId: string,
        activeKeyId: string): UI
{
        return {
                mode,
                previousMode: mode,
                activeMessageId,
                activeFolderId,
                activeKeyId,
                activeMainMenuIndex: 0,
                editingDraftBody: false,
                editingDraftSubject: false,
                editingDraftTo: false,
                editingDraftKeyName: false,
                editingDraftKeyPassphrase: false,
                sending: false,
                decrypting: false,
                generatingKey: false,
        };
}

export function isEditing (ui: UI)
{
        return ui.editingDraftTo ||
                ui.editingDraftSubject ||
                ui.editingDraftBody ||
                ui.editingDraftKeyName ||
                ui.editingDraftKeyPassphrase;
}

export function setMode (ui: UI, mode: string)
{
        const previousMode = ui.mode;
        return Helpers.assign(ui, { mode, previousMode });
}
