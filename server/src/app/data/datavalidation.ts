/// <reference path='../../../../typings/is-my-json-valid/is-my-json-valid.d.ts'/>

import Data = require('./data');
import FileSystem = require('./filesystem');
import Func = require('../../../../core/src/app/utils/function');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Message = require('../../../../core/src/app/message');
import Profile = require('../../../../core/src/app/profile');

import validator = require('is-my-json-valid');

interface ValidateFn<T> {
        (object: T): boolean;
        errors: Object[];
}

export function getDataErrors (
        data: Data.NarrativeData,
        profileSchema: JSON,
        messageSchema: JSON): string
{
        const profiles = <Profile.Profile[]>Helpers.arrayFromMap(data.profiles);
        const profileErrors = getJSONDirErrors(profileSchema, profiles);

        const messages = <Message.MessageState[]>Helpers.arrayFromMap(data.messages);
        const messageErrors = getJSONDirErrors(messageSchema, messages);

        return (profileErrors + messageErrors);
}

export function getJSONDirErrors<T extends { name: string }> (
        schema: Object, data: T[]): string
{
        const validate = validator(schema);

        const invalidElements = data.filter(
                element => !validate(element));
        const errors = invalidElements.map(
                element => getError(validate, element));

        return errors.join();
}

export function getError<T extends { name: string }> (
        validateFn: ValidateFn<T>, object: T): string
{
        return (validateFn(object) ?
                ''
                : object.name + ': ' + JSON.stringify(validateFn.errors));
}
