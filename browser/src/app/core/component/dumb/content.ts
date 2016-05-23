import Client = require('../../client');
import Compose = require('./compose');
import ComposeBodyContainer = require('../smart/composebodycontainer');
import Encryption = require('./encryption');
import Folder = require('./folder');
import Help = require('./help');
import Index = require('./index');
import LoadMenu = require('./loadmenu');
import LocalStorage = require('../../localstorage');
import Pager = require('./pager');
import MainMenu = require('./mainmenu');
import React = require('react');
import SaveMenu = require('./savemenu');
import UI = require('../../ui');

import Core = require('../core');
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
        default:
                break;
        }

        return Div({ className: 'content' }, content);
}

const Content = React.createFactory(renderContent);

function createIndex (state: Client.Client)
{
        const messages = Client.getActiveMessages(state);
        const activeMessageId = state.ui.activeMessageId;
        return Index({ messages, activeMessageId });
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
        return Pager({ message });
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
        const keyManagersById = state.data.keyManagersById;
        const activeId = state.data.player.activeKeyId;
        const selectedId = state.ui.activeKeyId;
        return Encryption({ keyManagersById, activeId, selectedId });
}

function createMainMenu (state: Client.Client)
{
        const activeMainMenuIndex = state.ui.activeMainMenuIndex;
        const menuItems = state.data.menuItems;
        return MainMenu({ activeMainMenuIndex, menuItems });
}

function createLoadMenu (state: Client.Client)
{
        const activeIndex = state.ui.activeLoadIndex;
        const saves = LocalStorage.getSaveNames();
        return LoadMenu({ activeIndex, saves });
}

function createSaveMenu (state: Client.Client)
{
        const activeIndex = state.ui.activeSaveIndex;
        const saves = LocalStorage.getSaveNames();
        return SaveMenu({ activeIndex, saves });
}

export = Content;
