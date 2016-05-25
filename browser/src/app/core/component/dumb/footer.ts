import Client = require('../../client');
import Clock = require('../../../../../../core/src/app/clock');
import EditSubject = require('../smart/editsubject');
import EditTo = require('../smart/editto');
import FooterCompose = require('./footercompose');
import FooterEncryption = require('./footerencryption');
import FooterIndex = require('./footerindex');
import FooterFolder = require('./footerfolder');
import FooterPager = require('./footerpager');
import InfoBar = require('./infobar');
import React = require('react');
import StatusBar = require('../dumb/statusbar');
import UI = require('../../ui');

import Core = require('../core');
import Div = Core.Div;
import Span = Core.Span;

interface FooterProps extends React.Props<any> {
        state: Client.Client;
}

function renderFooter(props: FooterProps)
{
        const state = props.state;

        const infoBarContent = createInfoBarContent(state);
        const infoBarTime = createInfoBarTime(state);
        const content = Div({ className: 'footer-infobar-content' },
                infoBarContent, infoBarTime);
        const infoBar = InfoBar({}, content);
        const statusBar = StatusBar({}, createStatusBarContent(state));

        return Div({ className: 'footer' }, infoBar, statusBar);
}

const Footer = React.createFactory(renderFooter);

function createInfoBarTime (state: Client.Client)
{
        const displayTime = Clock.displayGameTime(state.data.clock);
        return Div({ className: 'footer-infobar-time' }, displayTime);
}

function createInfoBarContent (state: Client.Client): React.ReactElement<any>
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

function createFooterCompose (state: Client.Client)
{
        const draftMessage = state.draftMessage;
        const draftBody = draftMessage.content.body;
        return FooterCompose({ draftBody });
}

function createFooterEncryption (state: Client.Client)
{
        const activeKeyId = state.ui.activeKeyId;
        const activeKey = state.data.keyManagersById[activeKeyId];
        return FooterEncryption({ activeKey });
}

function createFooterFolder (state: Client.Client)
{
        const activeFolder = Client.getActiveFolder(state);
        const folders = state.data.folders;
        return FooterFolder({ activeFolder, folders });
}

function createFooterIndex (state: Client.Client)
{
        const folder = Client.getActiveFolder(state);
        const folderName = folder.displayName;
        const messages = Client.getActiveMessages(state);
        return FooterIndex({ folderName, messages });
}

function createFooterPager (state: Client.Client)
{
        const activeMessage = Client.getActiveMessage(state);
        const folderId = state.ui.activeFolderId;
        const messages = state.data.messageIdsByFolderId[folderId];
        return FooterPager({ activeMessage, messages });
}

function createStatusBarContent (state: Client.Client): React.ReactElement<any>
{
        const message = state.draftMessage ? state.draftMessage.content : null;

        if (state.ui.editingDraftSubject) {
                return EditSubject({ value: message.subject });
        } else if (state.ui.editingDraftTo) {
                return EditTo({ value: message.to });
        } else if (state.ui.sending) {
                return Span({ className: 'statusbar-ongoing' }, 'Sending');
        } else if (state.ui.decrypting) {
                return Span({ className: 'statusbar-ongoing' }, 'Decrypting');
        } else {
                // Ensures 'empty' status bar has the same height as filled one
                return Span({ className: 'statusbar-empty'}, '.');
        }
}

export = Footer;
