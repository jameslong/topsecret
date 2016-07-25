import ActionCreators = require('../../action/actioncreators');
import ButtonInput = require('../dumb/buttoninput');
import Client = require('../../client');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../../../core/src/kbpgp');
import Prom = require('../../../../../core/src/utils/promise');
import React = require('react');
import Redux = require('../../redux/redux');
import Text = require('../dumb/text');

import Core = require('../common/core');
import Div = Core.Div;
import Form = Core.Form;
import Span = Core.Span;

interface NewGameProps extends React.Props<any> {
        state: Client.Client;
}

function renderNewGame(props: NewGameProps)
{
        const state = props.state;

        const firstNameLabel = Span({}, 'First Name:');
        const firstName = Text({
                placeholder: '',
                value: undefined,
                name: 'firstName',
                onChange: (e: any) => {
                        e.stopPropagation();
                        e.preventDefault();
                }
        });
        const lastNameLabel = Span({}, 'Last Name:');
        const lastName = Text({
                placeholder: '',
                value: undefined,
                name: 'lastName',
                onChange: (e: any) => {
                        e.stopPropagation();
                        e.preventDefault();
                }
        });
        const submit = ButtonInput({
                text: 'Login',
                disabled: false,
                onClick: () => {},
        });

        const formProps = {
                onSubmit: (submitEvent: any) => onSubmit(state, submitEvent)
        };
        const form = Form(formProps,
                Div({ className: 'new-game-form-item' },
                        firstNameLabel, firstName),
                Div({ className: 'new-game-form-item' },
                        lastNameLabel, lastName),
                Div({ className: 'new-game-button-wrapper' }, submit)
        );

        const bannerText = ` _   _  _____         _   _ ______ _______
| \\ | |/ ____|  /\\   | \\ | |  ____|__   __|
|  \\| | (___   /  \\  |  \\| | |__     | |
| . \` |\\___ \\ / /\\ \\ | . \` |  __|    | |
| |\\  |____) / ____ \\| |\\  | |____   | |
|_| \\_|_____/_/    \\_\\_| \\_|______|  |_|`;

        const banner = Div({ className: 'new-game-banner' }, bannerText);

        const footerText = 'WARNING:  The use of this U.S. Government system is restricted to authorized users only. Unauthorized access, use, or modification of this computer system or of the data contained herein or in transit to/from this system constitutes a violation of Title 18, United States Code, Section 1030 and state criminal and civil laws. These systems and equipment are subject to monitoring to ensure proper performance of applicable security features or procedures. Such monitoring may result in the acquisition, recording and analysis of all data being communicated, transmitted, processed or stored in this system by a user. If monitoring reveals possible evidence of criminal activity, such evidence may be provided to law enforcement personnel.';
        const footer = Div({ className: 'new-game-footer' }, footerText);

        return Div({ className: 'new-game'},
                Div({ className: 'new-game-content' }, banner, form, footer)
        );
}

const NewGame = React.createFactory(renderNewGame);

function onSubmit (state: Client.Client, e: any)
{
        const { firstName, lastName } =
                <{ firstName: string; lastName: string; }> extractFormValues(e);

        if (firstName && lastName) {
                const userId = `${firstName} ${lastName} <${firstName.toLowerCase()}.${lastName.toLowerCase()}@nsa.gov>`;
                const passphrase = `passphrase`;
                const asp = new Kbpgp.ASP({
                        progress_hook: (info) => {
                                const text = KbpgpHelpers.formatProgress(info);
                                const action = ActionCreators.newGameLoadingInfo(
                                        text);
                                Redux.handleAction(action);
                        }
                });

                const connecting = Prom.delay(100).then(res => {
                        const action = ActionCreators.newGameLoadingInfo(
                                'connecting to NSA network...');
                        Redux.handleAction(action);
                }).then(res => Prom.delay(1500)).then(res => {
                        const action = ActionCreators.newGameLoadingInfo(
                                'connection successful');
                        Redux.handleAction(action);
                }).then(res => Prom.delay(500)).then(res => {
                        const action = ActionCreators.newGameLoadingInfo(
                                'generating PGP key pair...');
                        Redux.handleAction(action);
                }).then(res => Prom.delay(1500)).then(res => {
                        KbpgpHelpers.generateKeyPair(userId, asp).then(instance => {
                                return KbpgpHelpers.exportKeyPair(instance, passphrase);
                        }).then(keyPair => {
                                const player = {
                                        email: userId,
                                        firstName,
                                        lastName,
                                        timezoneOffset: 0,
                                        publicKey: keyPair[0],
                                        privateKey: keyPair[1],
                                        passphrase,
                                };
                                const action = ActionCreators.newGame(player);
                                Redux.handleAction(action);
                        });
                });

                const action = ActionCreators.newGameLogin();
                Redux.handleAction(action);
        }

        e.preventDefault();
        e.stopPropagation();
}

function extractFormValues (formSubmitEvent: any): any
{
        const formValues: any = {};

        const form = formSubmitEvent.target;
        const formElements = form.elements;
        const formElementsLength = formElements.length;

        for (let elementIndex = 0; elementIndex < formElementsLength;
                elementIndex += 1)
        {
                const formElement = formElements[elementIndex];
                const type = formElement.type;

                const elementName: string = formElement.name;
                const elementValue: string = formElement.value;

                switch (type)
                {
                case 'text':
                        formValues[elementName] = elementValue;
                        break;
                default:
                        break;
                }
        }

        return formValues;
}

export = NewGame;
