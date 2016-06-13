import ActionCreators = require('../../action/actioncreators');
import ButtonInput = require('./buttoninput');
import Client = require('../../client');
import Kbpgp = require('../../../../../../core/src/app/kbpgp');
import React = require('react');
import Redux = require('../../redux/redux');
import Text = require('./text');

import Core = require('../core');
import Div = Core.Div;
import Form = Core.Form;

interface ContentProps extends React.Props<any> {
        state: Client.Client;
}

function renderContent(props: ContentProps)
{
        const state = props.state;

        const firstName = Text({
                placeholder: 'First Name',
                value: null,
                name: 'firstName',
                onChange: (e: any) => {
                        e.stopPropagation();
                        e.preventDefault();
                }
        });
        const lastName = Text({
                placeholder: 'Last Name',
                value: null,
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
                className: 'new-game',
                onSubmit: (submitEvent: any) => onSubmit(state, submitEvent)
        };
        return Form(formProps,
                Div({}, firstName),
                Div({}, lastName),
                submit);
}

const Content = React.createFactory(renderContent);

function onSubmit (state: Client.Client, e: any)
{
        const { firstName, lastName } =
                <{ firstName: string; lastName: string; }> extractFormValues(e);


        const userId = `${firstName} ${lastName} <${firstName.toLowerCase()}.${lastName.toLowerCase()}@nsa.gov>`;
        const passphrase = `passphrase`;
        Kbpgp.generateKeyPair(userId).then(instance => {
                return Kbpgp.exportKeyPair(instance, passphrase);
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

export = Content;
