/// <reference path="../../../typings/jquery/jquery.d.ts" />

import $ = require('jquery');
import State = require('../../../core/src/app/state');

export function narratives (url: string)
{
        const requestURL = url + '/narratives';
        const data = {};
        return get<State.Data>(requestURL, data);
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
