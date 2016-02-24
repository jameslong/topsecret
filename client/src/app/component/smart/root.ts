import ActionCreators = require('../../action/actioncreators');
import Command = require('../../command');
import Data = require('../../data');
import React = require('react');
import Redux = require('../../redux/redux');
import State = require('../../state');
import UI = require('../../ui');

import Core = require('../core');
import Div = Core.Div;
import Span = Core.Span;

import Content = require('../dumb/content');
import EditDraftKeyName = require('./editdraftkeyname');
import EditDraftKeyPassphrase = require('./editdraftkeypassphrase');
import EditSubject = require('./editsubject');
import EditTo = require('./editto');
import FooterCompose = require('../dumb/footercompose');
import FooterEncryption = require('../dumb/footerencryption');
import FooterIndex = require('../dumb/footerindex');
import FooterFolder = require('../dumb/footerfolder');
import FooterPager = require('../dumb/footerpager');
import Header = require('../dumb/header');
import InfoBar = require('../dumb/infobar');
import StatusBar = require('../dumb/statusbar');

interface RootProps extends React.Props<any> {
        state: State.State;
}

function renderRoot(props: RootProps)
{
        const state = props.state;
        const commands = State.getActiveCommands(state);

        const header = createHeader(state.ui.mode, commands);
        const footer = createFooter(state);
        const content = Content({ state });

        return Div({ className: 'root', onClick }, header, content, footer);
}

const Root = React.createFactory(renderRoot);

function onClick (e: MouseEvent)
{
        const action = ActionCreators.blur();
        Redux.handleAction(action);
}

function createHeader (mode: string, commands: Command.Command[])
{
        const data = commands.map(Command.getCommandSummary);
        return Header({ values: data });
}

function createFooter (state: State.State)
{
        const infoBar = InfoBar({}, createFooterInfoBarContent(state));
        const statusBar = StatusBar({}, createStatusBarContent(state));

        return Div({ className: 'footer' }, infoBar, statusBar);
}

function createFooterInfoBarContent (state: State.State): React.ReactElement<any>
{
        const mode = state.ui.mode === UI.Modes.HELP ?
                state.ui.previousMode : state.ui.mode;

        switch (mode) {
        case UI.Modes.INDEX_INBOX:
        case UI.Modes.INDEX_SENT:
                return createFooterIndex(state);
        case UI.Modes.PAGER:
                return createFooterPager(state);
        case UI.Modes.COMPOSE:
                return createFooterCompose(state);
        case UI.Modes.ENCRYPTION:
                return createFooterEncryption(state);
        case UI.Modes.FOLDER:
                return createFooterFolder(state);
        default:
                return null;
        }
}

function createFooterCompose (state: State.State)
{
        const draftMessage = state.draftMessage;
        const draftBody = draftMessage.content.body;
        return FooterCompose({ draftBody });
}

function createFooterEncryption (state: State.State)
{
        const activeKeyId = state.ui.activeKeyId;
        const activeKey = state.data.keyManagersById[activeKeyId];
        return FooterEncryption({ activeKey });
}

function createFooterFolder (state: State.State)
{
        const activeFolder = State.getActiveFolder(state);
        const folders = state.data.folders;
        return FooterFolder({ activeFolder, folders });
}

function createFooterIndex (state: State.State)
{
        const folder = State.getActiveFolder(state);
        const folderName = folder.displayName;
        const messages = State.getActiveMessages(state);
        return FooterIndex({ folderName, messages });
}

function createFooterPager (state: State.State)
{
        const activeMessage = State.getActiveMessage(state);
        const folderId = state.ui.activeFolderId;
        const messages = state.data.messageIdsByFolderId[folderId];
        return FooterPager({ activeMessage, messages });
}

function createStatusBarContent (state: State.State): React.ReactElement<any>
{
        const message = state.draftMessage ? state.draftMessage.content : null;

        if (state.ui.editingDraftSubject) {
                return EditSubject({ value: message.subject });
        } else if (state.ui.editingDraftTo) {
                return EditTo({ value: message.to.join(',') });
        } else if (state.ui.editingDraftKeyName) {
                return EditDraftKeyName({ value: '' });
        } else if (state.ui.editingDraftKeyPassphrase) {
                const userId = state.data.player.email;
                const keyId = state.draftKey.id;
                return EditDraftKeyPassphrase({ value: '', userId, keyId });
        } else if (state.ui.generatingKey) {
                return Span({ className: 'statusbar-ongoing' }, 'Generating key');
        } else if (state.ui.sending) {
                return Span({ className: 'statusbar-ongoing' }, 'Sending');
        } else if (state.ui.decrypting) {
                return Span({ className: 'statusbar-ongoing' }, 'Decrypting');
        } else {
                // Ensures 'empty' status bar has the same height as filled one
                return Span({ className: 'statusbar-empty'}, '.');
        }
}

export = Root;
