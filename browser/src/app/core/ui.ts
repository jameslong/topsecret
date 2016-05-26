import Helpers = require('../../../../core/src/app/utils/helpers');

export const Modes = {
        INDEX_INBOX: 'INDEX_INBOX',
        INDEX_SENT: 'INDEX_SENT',
        HELP: 'HELP',
        PAGER: 'PAGER',
        COMPOSE: 'COMPOSE',
        COMPOSE_BODY: 'COMPOSE_BODY',
        ENCRYPTION: 'ENCRYPTION',
        FOLDER: 'FOLDER',
        LOAD_MENU: 'LOAD_MENU',
        MAIN_MENU: 'MAIN_MENU',
        SAVE_MENU: 'SAVE_MENU',
}

export interface UI {
        mode: string;
        previousMode: string;
        activeMessageId: string;
        activeFolderId: string;
        activeKeyIndex: number;
        activeMainMenuIndex: number;
        activeSaveIndex: number;
        activeLoadIndex: number;
        editingDraftSubject: boolean;
        editingDraftTo: boolean;
        editingDraftKeyName: boolean;
        editingDraftKeyPassphrase: boolean;
        sending: boolean;
        decrypting: boolean;
        generatingKey: boolean;
}

export function createUI (
        mode: string, activeMessageId: string, activeFolderId: string): UI
{
        return {
                mode,
                previousMode: mode,
                activeMessageId,
                activeFolderId,
                activeKeyIndex: 0,
                activeMainMenuIndex: 0,
                activeSaveIndex: 0,
                activeLoadIndex: 0,
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
        return ui.mode === Modes.COMPOSE_BODY ||
                ui.editingDraftTo ||
                ui.editingDraftSubject ||
                ui.editingDraftKeyName ||
                ui.editingDraftKeyPassphrase;
}

export function setMode (ui: UI, mode: string)
{
        const previousMode = ui.mode;
        return Helpers.assign(ui, { mode, previousMode });
}
