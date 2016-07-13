/// <reference path="../../../typings/jquery/jquery.d.ts" />

import $ = require('jquery');
import ActionCreators = require('./action/actioncreators');
import Map = require('./../../../core/src/utils/map');
import EditorMessage = require('./editormessage');
import Narrative = require('./narrative');
import Redux = require('./redux/redux');
import ReplyOption = require('./../../../core/src/replyoption');

export function requestNarratives (url: string)
{
        const requestURL = url + '/narratives';
        const data = {};

        const onSuccess: AjaxSuccess<Narrative.NarrativesData> =
                (data, textStatus, jqXHR) => onNarratives(data);

        get(requestURL, data, onSuccess, onAjaxError);

        console.log('loading narratives...');
}

function onNarratives(data: Narrative.NarrativesData)
{
        console.log('loaded narratives');

        const narratives = Map.map(data, Narrative.convertToNarrative);
        const action = ActionCreators.setGameData(narratives);
        Redux.handleAction(action);
}

export function saveMessage (
        url: string,
        narrativeName: string,
        message: EditorMessage.EditorMessage)
{
        const requestURL = url + '/savemessage';

        const name = message.name;
        const messageData = EditorMessage.convertToMessageData(message);
        const data = {
                narrativeName,
                message: messageData,
        };

        const onSuccess: AjaxSuccess<void> =
                (data, textStatus, jqXHR) => onSaveMessage(name);

        post(requestURL, data, onSuccess, onAjaxError);
        console.log(`saving message ${name}...`);
}

function onSaveMessage (name: string)
{
        console.log(`saved message ${name}`);
}

export function deleteMessage (url: string, narrativeName: string, name: string)
{
        const requestURL = url + '/deletemessage';

        const data = {
                narrativeName,
                messageName: name,
        };

        const onSuccess: AjaxSuccess<void> =
                (data, textStatus, jqXHR) => onDeleteMessage(name);

        post(requestURL, data, onSuccess, onAjaxError);
        console.log(`deleting message ${name}...`);
}

function onDeleteMessage (name: string)
{
        console.log(`deleted message ${name}`);
}

export function saveReplyOption (
        url: string,
        narrativeName: string,
        name: string,
        value: ReplyOption.ReplyOptions)
{
        const requestURL = url + '/savereplyoption';

        const data = { narrativeName, name, value };

        const onSuccess: AjaxSuccess<void> =
                (data, textStatus, jqXHR) => onSaveReplyOption(name);

        post(requestURL, data, onSuccess, onAjaxError);
        console.log(`saving reply options ${name}...`);
}

function onSaveReplyOption (name: string)
{
        console.log(`saved reply options ${name}`);
}

export function deleteReplyOption (
        url: string, narrativeName: string, name: string)
{
        const requestURL = url + '/deletereplyoption';

        const data = { narrativeName, name };

        const onSuccess: AjaxSuccess<void> =
                (data, textStatus, jqXHR) => onDeleteReplyOption(name);

        post(requestURL, data, onSuccess, onAjaxError);
        console.log(`deleting reply options ${name}...`);
}

function onDeleteReplyOption (name: string)
{
        console.log(`deleted reply options ${name}`);
}

export function saveString (
        url: string,
        narrativeName: string,
        name: string,
        value: string)
{
        const requestURL = url + '/savestring';

        const data = { narrativeName, name, value };

        const onSuccess: AjaxSuccess<void> =
                (data, textStatus, jqXHR) => onSaveString(name);

        post(requestURL, data, onSuccess, onAjaxError);
        console.log(`saving string ${name}...`);
}

function onSaveString (name: string)
{
        console.log(`saved string ${name}`);
}

export function deleteString (
        url: string, narrativeName: string, name: string)
{
        const requestURL = url + '/deletestring';

        const data = { narrativeName, name };

        const onSuccess: AjaxSuccess<void> =
                (data, textStatus, jqXHR) => onDeleteString(name);

        post(requestURL, data, onSuccess, onAjaxError);
        console.log(`deleting string ${name}...`);
}

function onDeleteString (name: string)
{
        console.log(`deleted string ${name}`);
}

export function onAjaxError (
        jqXHR: JQueryXHR, textStatus: string, errorThrown: string)
{
        var errorInfo = {
                jqXHR: jqXHR,
                textStatus: textStatus,
                errorThrown: errorThrown,
        };
        console.log('AJAX request error', errorInfo);
}

interface AjaxSuccess<T> {
        (data: T, textStatus: string, jqXHR: JQueryXHR): void;
}

type AjaxError = (
        jqXHR: JQueryXHR,
        textStatus: string,
        errorThrown: string) => void;

export function post<T> (
        url: string,
        data: Object,
        onSuccess: AjaxSuccess<T>,
        onError: AjaxError)
{
        var stringData = JSON.stringify(data);

        $.ajax(url, {
                type: 'POST',
                contentType: 'application/json',
                data: stringData,
                success: onSuccess,
                error: onError,
        });
}

export function get<T> (
        url: string,
        data: Object,
        onSuccess: AjaxSuccess<T>,
        onError: AjaxError)
{
        $.ajax({
                url: url,
                data: data,
                success: onSuccess,
                error: onError,
        });
}
