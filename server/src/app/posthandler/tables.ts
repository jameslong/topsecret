import DBHelpers = require('../../../../game/src/app/dbhelpers');
import ReplyOption = require('../../../../game/src/app/replyoption');
import PostHandler = require('./posthandler');
import Request = require('../../../../game/src/app/requesttypes');

export function handleCreateTableRequest (
        tableName: string, requestFn: Request.CreateTableRequest, res: any)
{
        var callback = PostHandler.createRequestCallback(res);
        DBHelpers.createTable(tableName, requestFn, callback);
}

export function handleDeleteTableRequest (
        tableName: string, requestFn: Request.DeleteTableRequest, res: any)
{
        var callback = PostHandler.createRequestCallback(res);
        DBHelpers.deleteTable(tableName, requestFn, callback);
}
