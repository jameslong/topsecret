/// <reference path='../../../../typings/is-my-json-valid/is-my-json-valid.d.ts'/>

import Data = require('./data');
import FileSystem = require('./filesystem');
import Func = require('../../../../core/src/app/utils/function');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Message = require('../../../../core/src/app/message');
import Profile = require('../../../../core/src/app/profile');
import Script = require('../../../../core/src/app/script');

import validator = require('is-my-json-valid');

export function getDataErrors (
        data: Data.NarrativeData,
        profileSchema: JSON,
        messageSchema: JSON): Object[]
{
        const profiles = <Profile.Profile[]>Helpers.arrayFromMap(data.profiles);
        const profileErrors = getJSONDirErrors(profileSchema, profiles);

        const messages = <Message.ThreadMessage[]>Helpers.arrayFromMap(
                data.messages);
        const messageErrors = getJSONDirErrors(messageSchema, messages);

        const scriptErrors = getListErrors(messages,
                message => Script.getScriptErrors(message.script));

        return profileErrors.concat(messageErrors, scriptErrors);
}

interface SchemaValidateFn<T> {
        (object: T): boolean;
        errors: Object[];
}

export function getJSONDirErrors<T extends { name: string }> (
        schema: Object, data: T[]): Object[]
{
        const validate = validator(schema);

        const invalidElements = data.filter(
                element => !validate(element));
        return invalidElements.reduce((result, element) => {
                const error = getError(validate, element);
                if (error) {
                        result.push(error);
                }
                return result;
        }, []);
}

export function getError<T extends { name: string }> (
        validateFn: SchemaValidateFn<T>, object: T): Object
{
        return validateFn(object) ? '' : { [object.name]: validateFn.errors };
}

function getListErrors<T extends { name: string }> (
        list: T[], validate: (element: T) => string)
{
        return list.reduce((result, element) => {
                const error = validate(element);
                if (error) {
                        console.log('error:', element.name, error);
                        result.push({ [element.name]: error });
                }
                return result;
        }, []);
}
