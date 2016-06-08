/// <reference path='../../../typings/is-my-json-valid/is-my-json-valid.d.ts'/>

import Helpers = require('./utils/helpers');
import Map = require('./utils/map');
import Message = require('./message');
import Profile = require('./profile');
import Script = require('./script');
import State = require('./state');

import validator = require('is-my-json-valid');

export function getDataErrors (
        data: State.NarrativeData,
        profileSchema: JSON,
        messageSchema: JSON,
        replyOptionSchema: JSON): Object[]
{
        const profileErrors = getJSONDirErrors(profileSchema, data.profiles);
        const messageErrors = getJSONDirErrors(messageSchema, data.messages);
        const replyOptionErrors = getJSONDirErrors(
                replyOptionSchema, data.replyOptions);

        const messageList = <Message.ThreadMessage[]>Helpers.arrayFromMap(
                data.messages);
        const scriptErrors = getListErrors(messageList,
                message => Script.getScriptErrors(message.script));

        return profileErrors.concat(
                messageErrors, replyOptionErrors, scriptErrors);
}

interface SchemaValidateFn<T> {
        (object: T): boolean;
        errors: Object[];
}

export function getJSONDirErrors<T> (
        schema: Object, data: Map.Map<T>): Object[]
{
        const validate = validator(schema);

        return Map.reduce(data, (result, element, key) => {
                const error = getError(validate, element, key);
                if (error) {
                        result.push(error);
                }
                return result;
        }, []);
}

export function getError<T> (
        validateFn: SchemaValidateFn<T>, object: T, name: string): Object
{
        return validateFn(object) ? '' : { [name]: validateFn.errors };
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
