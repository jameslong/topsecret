/// <reference path="../../../../typings/kbpgp/kbpgp.d.ts"/>

import Client = require('../client');
import Map = require('../../../../core/src/utils/map');
import MessageCore = require('../../../../core/src/message');
import Message = require('../message');
import Player = require('../player');
import Redux = require('../redux/redux');

export const Types = {
        BLUR: 'BLUR',
        KEY_DOWN: 'KEY_DOWN',
        SET_ACTIVE_MESSAGE: 'SET_ACTIVE_MESSAGE',
        SET_DRAFT_BODY: 'SET_DRAFT_BODY',
        SET_DRAFT_SUBJECT: 'SET_DRAFT_SUBJECT',
        SET_DRAFT_TO: 'SET_DRAFT_TO',
        DIPLAY_MESSAGE: 'DIPLAY_MESSAGE',

        TICK: 'TICK',
        TICK_FASTER: 'TICK_FASTER',
        TICK_SLOWER: 'TICK_SLOWER',
        ADD_TIME_OFFSET: 'ADD_TIME_OFFSET',

        SET_MODE: 'SET_MODE',
        COMPOSE_MESSAGE: 'COMPOSE_MESSAGE',
        COMPOSE_REPLY: 'COMPOSE_REPLY',
        RECEIVE_REPLY: 'RECEIVE_REPLY',
        SEND_MESSAGE: 'SEND_MESSAGE',
        SENDING_MESSAGE: 'SENDING_MESSAGE',
        DECRYPT_MESSAGE: 'DECRYPT_MESSAGE',
        DECRYPTING_MESSAGE: 'DECRYPTING_MESSAGE',
        SET_ACTIVE_FOLDER: 'SET_ACTIVE_FOLDER',
        DISPLAY_FOLDER: 'DISPLAY_FOLDER',
        EDIT_BODY: 'EDIT_BODY',
        END_EDIT_BODY: 'END_EDIT_BODY',
        EDIT_SUBJECT: 'EDIT_SUBJECT',
        EDIT_TO: 'EDIT_TO',

        OPEN_ATTACHMENT: 'OPEN_ATTACHMENT',

        SET_ACTIVE_KEY_INDEX: 'SET_ACTIVE_KEY_INDEX',
        IMPORT_KEYS: 'IMPORT_KEYS',

        SET_ACTIVE_LOAD_MENU_INDEX: 'SET_ACTIVE_LOAD_MENU_INDEX',
        SET_ACTIVE_MENU_INDEX: 'SET_ACTIVE_MENU_INDEX',
        SET_ACTIVE_SAVE_MENU_INDEX: 'SET_ACTIVE_SAVE_MENU_INDEX',

        IMPORT_SAVE_DATA: 'IMPORT_SAVE_DATA',
        NEW_GAME: 'NEW_GAME',
        NEW_GAME_LOGIN: 'NEW_GAME_LOGIN',
        NEW_GAME_LOADING_INFO: 'NEW_GAME_LOADING_INFO',
        SET_NEW_PLAYER_INFO: 'SET_NEW_GAME_PLAYER_INFO',
};

export interface Blur extends Redux.Action<void> {}
export interface KeyDown extends Redux.Action<KeyboardEvent> {}
export interface SetActiveMessage extends Redux.Action<string> {}
export interface SetDraftBody extends Redux.Action<string> {}
export interface SetDraftSubject extends Redux.Action<string> {}
export interface SetDraftTo extends Redux.Action<string> {}
export interface DisplayMessage extends Redux.Action<string> {}

export interface Tick extends Redux.Action<void> {}
export interface TickFaster extends Redux.Action<void> {}
export interface TickSlower extends Redux.Action<void> {}
export interface AddTimeOffset extends Redux.Action<number> {}

export interface SetMode extends Redux.Action<string> {}
export interface SetActiveFolder extends Redux.Action<string> {}
export interface EditBody extends Redux.Action<void> {}
export interface EndEditBody extends Redux.Action<void> {}
export interface EditSubject extends Redux.Action<boolean> {}
export interface EditTo extends Redux.Action<boolean> {}

export interface OpenAttachment extends Redux.Action<string> {}

export interface ComposeMessageParams {
        sender: string;
}
export interface ComposeMessage extends Redux.Action<ComposeMessageParams> {}

export interface ComposeReplyParams {
        message: Message.Message;
        sender: string;
}
export interface ComposeReply extends Redux.Action<ComposeReplyParams> {}

export interface ReceiveReply extends Redux.Action<MessageCore.Reply> {}

export interface SendMessageParams {
        message: Message.Message;
        parentId: string;
}
export interface SendMessage extends Redux.Action<SendMessageParams> {}
export interface SendingMessage extends Redux.Action<boolean> {}

export interface DecryptMessageParams {
        messageId: string;
        decryptedBody: string;
}
export interface DecryptMessage extends Redux.Action<DecryptMessageParams> {}
export interface DecryptingMessage extends Redux.Action<boolean> {}

export interface DisplayFolderParams {
        folderId: string;
        messageId: string;
        folderType: string;
}
export interface DisplayFolder extends Redux.Action<DisplayFolderParams> {}

export interface SetActiveKeyIndex extends Redux.Action<number> {}
export type ImportKeysParams = string[];
export interface ImportKeys extends Redux.Action<ImportKeysParams> {}

export interface SetActiveLoadIndex extends Redux.Action<number> {}
export interface SetActiveMenuIndex extends Redux.Action<number> {}
export interface SetActiveSaveIndex extends Redux.Action<number> {}

export interface ImportSaveData extends Redux.Action<Client.SaveData> {}
export interface NewGame extends Redux.Action<Player.Player> {}
export interface NewGameLogin extends Redux.Action<void> {}

export interface SetNewGamePlayerInfoParams {
        firstName: string;
        lastName: string;
        privateKey: string;
}
export interface SetNewGamePlayerInfo extends Redux.Action<SetNewGamePlayerInfoParams> {}
export interface NewGameLoadingInfo extends Redux.Action<string> {}
