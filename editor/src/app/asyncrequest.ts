/// <reference path="../../../typings/jquery/jquery.d.ts" />

module AsyncRequest {
        export function requestNarratives (url: string)
        {
                const requestURL = url + '/narratives';
                const data = {};

                const onSuccess: AjaxSuccess<Narrative.NarrativesMutable> =
                        (data, textStatus, jqXHR) => onNarratives(data);

                get(requestURL, data, onSuccess, onAjaxError);

                console.log('loading narratives...');
        }

        function onNarratives(narrativesMutable: Narrative.NarrativesMutable)
        {
                console.log('loaded narratives');

                const narratives = Helpers.mapFromObject(
                        narrativesMutable, Narrative.convertToImmutableNarrative);

                const action = ActionCreators.setGameData(narratives);
                Redux.handleAction(action);
        }

        export function saveMessage (
                url: string,
                narrativeName: string,
                message: Message.Message)
        {
                const requestURL = url + '/savemessage';

                const name = message.name;
                const messageMutable = Message.convertToMutableMessage(
                        message);
                const data = {
                        narrativeName: narrativeName,
                        message: messageMutable,
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

        export function deleteMessage (
                url: string, narrativeName: string, name: string)
        {
                const requestURL = url + '/deletemessage';

                const data = {
                        narrativeName: narrativeName,
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

        export function saveString (
                url: string,
                narrativeName: string,
                name: string,
                value: string)
        {
                const requestURL = url + '/savestring';

                const data = {
                        narrativeName: narrativeName,
                        name: name,
                        value: value,
                };

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

                const data = {
                        narrativeName: narrativeName,
                        name: name,
                };

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
}
