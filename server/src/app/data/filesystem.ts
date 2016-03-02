/// <reference path="../../../../typings/node/node.d.ts"/>

import Arr = require('../../../../game/src/app/utils/array');
import Data = require('./data');
import Map = require('../../../../game/src/app/utils/map');
import Str = require('../../../../game/src/app/utils/string');

import fs = require('fs');

export interface FileSystem {
        readdirSync: (path: string) => string[];
        readdir: (path: string,
            callback: (error: string, files: string[]) => void) => string[];
        readFileSync: Function;
        statSync: (path: string) => Data.Stats;
        unlinkSync: (path: string) => void;
        writeFileSync: (path: string, data: string) => void;
}

export function readFilenamesSync(path: string): string[]
{
        return fs.readdirSync(path);
}

export function loadDirectoryNamesSync(path: string): string[]
{
        return fs.readdirSync(path).filter((filename) =>
                isDirectorySync(path, filename));
}

export function isDirectorySync(path: string, filename: string): boolean
{
        return fs.statSync(path + '/' + filename).isDirectory();
}

export function loadJSONSync<T>(path: string): T
{
        const encoding = 'utf8';
        var data = fs.readFileSync(path, encoding);
        return JSON.parse(data);
}

export function loadJSONDirSync<T>(path: string): T[]
{
        const filenames = readFilenamesSync(path);
        const filepaths = filenames.map(name => Data.join(path, name));
        return filepaths.map(path => loadJSONSync<T>(path));
}

export function loadJSONDirAsMap<T>(path: string): Map.Map<T>
{
        const filenames = readFilenamesSync(path);
        const stringNames = filenames.map(Str.removeFileExtension);
        const filepaths = filenames.map(name => Data.join(path, name));

        return Arr.arrayToMap(
                stringNames, filepaths, path => loadJSONSync<T>(path));
}

export function saveJSONSync(path: string, data: Object)
{
        var dataString = JSON.stringify(data, null, 8);
        fs.writeFileSync(path, dataString);
}

export function deleteFile(path: string)
{
        fs.unlinkSync(path);
}
