/// <reference path='../typings/is-my-json-valid/is-my-json-valid.d.ts'/>

import Data = require('./data');
import FileSystem = require('./filesystem');
import Map = require('../game/utils/map');

import validator = require('is-my-json-valid');

interface ValidateFn<T> {
        (object: T): boolean;
        errors: Object[];
}

export function getDataErrors (data: Data.NarrativeData): string
{
        const profileSchema = FileSystem.loadJSONSync('src/app/data/profileschema.json');
        const profiles = Map.arrayFromMap(data.profiles);
        const profileErrors = getJSONDirErrors(profileSchema, profiles);

        const messageSchema = FileSystem.loadJSONSync('src/app/data/messageschema.json');
        const messages = Map.arrayFromMap(data.messages);
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
