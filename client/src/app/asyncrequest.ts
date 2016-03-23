/// <reference path="../../../typings/jquery/jquery.d.ts" />

import $ = require('jquery');
import Helpers = require('../../../core/src/app/utils/helpers');
import State = require('../../../core/src/app/state');

export function narratives (url: string)
{
        const requestURL = url + '/narratives';
        const data = {};
        return get<State.Narratives>(requestURL, data).then(data => {
                const tasks = Helpers.arrayFromMap(data,
                        narrative => State.addKeyManagers(narrative));
                return Promise.all(tasks);
        }).then(data => Helpers.mapFromNameArray(data));
}

export function get<T> (
        url: string,
        data: Object): Promise<T>
{
        return new Promise((resolve, reject) => {
                $.ajax({
                        url: url,
                        data: data,
                        success: (data, textStatus, jqXHR) => resolve(data),
                        error: (jqXHR, textStatus, err) => reject(err),
                });
        });
}
