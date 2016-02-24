import Compose = require('./compose');
import Encryption = require('./encryption');
import Folder = require('./folder');
import Help = require('./help');
import Index = require('./index');
import Pager = require('./pager');
import React = require('react');
import State = require('../../state');
import UI = require('../../ui');

import Core = require('../core');
import Div = Core.Div;

interface ContentProps extends React.Props<any> {
        state: State.State;
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
        case UI.Modes.FOLDER:
                content = createFolder(state);
                break;
        case UI.Modes.ENCRYPTION:
                content = createEncryption(state);
                break;
        default:
                break;
        }

        return Div({ className: 'content' }, content);
}

const Content = React.createFactory(renderContent);

function createIndex (state: State.State)
{
        const messages = State.getActiveMessages(state);
        const activeMessageId = state.ui.activeMessageId;
        return Index({ messages, activeMessageId });
}

function createHelp (state: State.State)
{
        const commands = State.getCommands(
                state.data, state.ui.previousMode);
        return Help({ commands });
}

function createPager (state: State.State)
{
        const message = State.getActiveMessage(state);
        return Pager({ message });
}

function createCompose (state: State.State)
{
        const draft = state.draftMessage;
        const ui = state.ui;
        return Compose({ draft, ui });
}

function createFolder (state: State.State)
{
        const foldersById = state.data.foldersById;
        const activeFolderId = state.ui.activeFolderId;
        return Folder({ foldersById, activeFolderId });
}

function createEncryption (state: State.State)
{
        const keyManagersById = state.data.keyManagersById;
        const activeId = state.data.player.activeKeyId;
        const selectedId = state.ui.activeKeyId;
        return Encryption({ keyManagersById, activeId, selectedId });
}

export = Content;
