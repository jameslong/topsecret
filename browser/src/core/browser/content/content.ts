import Client = require('../../client');
import Compose = require('./compose/compose');
import ComposeBodyContainer = require('./compose/composebodycontainer');
import Encryption = require('./encryptionkeys/encryption');
import Folder = require('./folder/folder');
import Help = require('./help/help');
import HowToPlay = require('./howtoplay/howtoplay');
import Index = require('./index/index');
import LoadMenu = require('./loadmenu/loadmenu');
import LocalStorage = require('../../localstorage');
import Menu = require('../../menu');
import Pager = require('./pager/pager');
import MainMenu = require('./mainmenu/mainmenu');
import React = require('react');
import SaveMenu = require('./savemenu/savemenu');
import UI = require('../../ui');

import Core = require('../common/core');
import Div = Core.Div;

interface ContentProps extends React.Props<any> {
        state: Client.Client;
}

function renderContent(props: ContentProps)
{
        const state = props.state;
        let content: React.ReactElement<any> = null;

        switch (state.ui.mode) {
        case UI.Modes.INDEX_INBOX:
        case UI.Modes.INDEX_SENT:
                content = createIndex(state);
                break;
        case UI.Modes.HELP:
                content = createHelp(state);
                break;
        case UI.Modes.PAGER:
                content = createPager(state);
                break;
        case UI.Modes.COMPOSE:
                content = createCompose(state);
                break;
        case UI.Modes.COMPOSE_BODY:
                content = createComposeBody(state);
                break;
        case UI.Modes.FOLDER:
                content = createFolder(state);
                break;
        case UI.Modes.ENCRYPTION:
                content = createEncryption(state);
                break;
        case UI.Modes.MAIN_MENU:
                content = createMainMenu(state);
                break;
        case UI.Modes.SAVE_MENU:
                content = createSaveMenu(state);
                break;
        case UI.Modes.LOAD_MENU:
                content = createLoadMenu(state);
                break;
        case UI.Modes.HOW_TO_PLAY:
                content = HowToPlay();
                break;
        default:
                break;
        }

        return Div({ id: 'content' }, content);
}

const Content = React.createFactory(renderContent);

function createIndex (state: Client.Client)
{
        const messages = Client.getActiveMessages(state);
        const activeMessageId = state.ui.activeMessageId;
        const utcOffsetHours = state.data.player.timezoneOffset;
        return Index({ messages, activeMessageId, utcOffsetHours });
}

function createHelp (state: Client.Client)
{
        const commands = Client.getCommands(
                state.data, state.ui.previousMode);
        return Help({ commands });
}

function createPager (state: Client.Client)
{
        const message = Client.getActiveMessage(state);
        const utcOffsetHours = state.data.player.timezoneOffset;
        return Pager({ message, utcOffsetHours });
}

function createCompose (state: Client.Client)
{
        const draft = state.draftMessage;
        const ui = state.ui;
        return Compose({ draft });
}

function createComposeBody (state: Client.Client)
{
        const draft = state.draftMessage;
        const ui = state.ui;
        return ComposeBodyContainer({ draft });
}

function createFolder (state: Client.Client)
{
        const foldersById = state.data.foldersById;
        const activeFolderId = state.ui.activeFolderId;
        return Folder({ foldersById, activeFolderId });
}

function createEncryption (state: Client.Client)
{
        const knownKeyIds = state.data.knownKeyIds;
        const profilesById = state.data.profilesById;
        const selectedIndex = state.ui.activeKeyIndex;
        return Encryption({ knownKeyIds, profilesById, selectedIndex });
}

function createMainMenu (state: Client.Client)
{
        const activeMainMenuIndex = state.ui.activeMainMenuIndex;
        const items = Menu.getMainMenuItems(state.ui.hasSeenInbox);
        return MainMenu({
                activeMainMenuIndex,
                menuItems: items,
        });
}

function createLoadMenu (state: Client.Client)
{
        const activeIndex = state.ui.activeLoadIndex;
        const saves = Menu.getLoadMenuItems();
        return LoadMenu({ activeIndex, saves });
}

function createSaveMenu (state: Client.Client)
{
        const activeIndex = state.ui.activeSaveIndex;
        const saves = Menu.getSaveMenuItems();
        return SaveMenu({ activeIndex, saves });
}

export = Content;
