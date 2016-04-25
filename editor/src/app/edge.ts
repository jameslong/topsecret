import ActionCreators = require('./action/actioncreators');
import Map = require('./../../../core/src/app/utils/map');
import MathUtils = require('./math');
import Message = require('./message');
import MessageDelay = require('./messagedelay');
import Narrative = require('./narrative');
import Redux = require('./redux/redux');

export enum Type {
        Fallback,
        Child,
        ReplyOption,
}

export interface Edge {
        name: string;
        source: string;
        target: string;
        line: MathUtils.Line;
        type: Type;
};

export type Edges = Edge[];

export function createEdges (
        messages: Message.Messages, vertexSize: MathUtils.Coord)
{
        let result: Edge[] = [];

        Map.forEach(messages, source => {
                const edges = createMessageEdges(messages, source, vertexSize);
                result.push(...edges);
        });

        return result;
}

function createMessageEdges (
        messages: Message.Messages,
        message: Message.Message,
        vertexSize: MathUtils.Coord)
{
        const fallback = createFallbackEdge(messages, message, vertexSize);
        const replyOptions = createReplyOptionEdges(
                messages, message, vertexSize);
        const children = createChildEdges(messages, message, vertexSize);
        return fallback.concat(children, replyOptions);
}

function createEdgeName (sourceName: string, type: Type, index: number)
{
        return `${sourceName}_${type}_${index}`;
}

function createFallbackEdge (
        messages: Message.Messages,
        source: Message.Message,
        vertexSize: MathUtils.Coord)
{
        const fallback = source.fallback;
        if (fallback && Map.exists(messages, fallback.name)) {
                const type = Type.Fallback;
                const name = createEdgeName(source.name, type, 0);
                const target = messages[fallback.name];
                return [createEdge(source, target, type, name, vertexSize)];
        } else {
                return [];
        }
}


function createReplyOptionEdges (
        messages: Message.Messages,
        source: Message.Message,
        vertexSize: MathUtils.Coord)
{
        const result: Edge[] = [];
        return source.replyOptions.reduce((result, option, index) => {
                Map.exists(messages, option.messageDelay.name) ?
                        result.push(createReplyOptionEdge(
                                messages, source, index, vertexSize)) :
                        result;
                return result;
        }, result);
}

function createReplyOptionEdge (
        messages: Message.Messages,
        source: Message.Message,
        index: number,
        vertexSize: MathUtils.Coord)
{
        const type = Type.ReplyOption;
        const name = createEdgeName(source.name, type, index);
        const option = source.replyOptions[index];
        const target = messages[option.messageDelay.name];

        return createEdge(source, target, type, name, vertexSize);
}

function createChildEdges (
        messages: Message.Messages,
        source: Message.Message,
        vertexSize: MathUtils.Coord)
{
        const result: Edge[] = [];
        return source.children.reduce((result, option, index) => {
                Map.exists(messages, option.name) ?
                        result.push(createChildEdge(
                                messages, source, index, vertexSize)) :
                        result;
                return result;
        }, result);
}

function createChildEdge (
        messages: Message.Messages,
        source: Message.Message,
        index: number,
        vertexSize: MathUtils.Coord)
{
        const type = Type.Child
        const name = createEdgeName(source.name, type, index);
        const child = source.children[index];
        const target = messages[child.name];

        return createEdge(source, target, type, name, vertexSize);
}

function createEdge (
        source: Message.Message,
        target: Message.Message,
        type: Type,
        name: string,
        vertexSize: MathUtils.Coord): Edge
{
        const sourceName = source.name;
        const targetName = target.name;

        const sourcePosition = MathUtils.add(source.position, vertexSize);
        const line = {
                start: sourcePosition,
                end: target.position,
        };
        return {
                name,
                source: sourceName,
                target: targetName,
                line,
                type,
        };
}
