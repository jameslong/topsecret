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
        const fallback = message.fallback ?
                createFallbackEdge(messages, message, vertexSize) : [];
        const replyOptions =
                createReplyOptionEdges(messages, message, vertexSize);
        const children = createChildrenEdges(messages, message, vertexSize);
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
        const type = Type.Fallback;
        const name = createEdgeName(source.name, type, 0);
        return [createMessageDelayEdge(
                messages,
                source,
                fallback,
                type,
                name,
                vertexSize)];
}

function createReplyOptionEdges (
        messages: Message.Messages,
        source: Message.Message,
        vertexSize: MathUtils.Coord)
{
        return source.replyOptions.map((option, index) => {
                const type = Type.ReplyOption;
                const name = createEdgeName(source.name, type, index);

                return createMessageDelayEdge(
                        messages,
                        source,
                        option.messageDelay,
                        type,
                        name,
                        vertexSize);
        });
}

function createChildrenEdges (
        messages: Message.Messages,
        source: Message.Message,
        vertexSize: MathUtils.Coord): Edge[]
{
        return source.children.map((child, index) => {
                const type = Type.Child;
                const name = createEdgeName(source.name, type, index);
                return createMessageDelayEdge(
                        messages,
                        source,
                        child,
                        type,
                        name,
                        vertexSize);
        });
}

function createMessageDelayEdge (
        messages: Message.Messages,
        source: Message.Message,
        messageDelay: MessageDelay.MessageDelay,
        type: Type,
        name: string,
        vertexSize: MathUtils.Coord)
{
        const target = messages[messageDelay.name];
        return target ?
                createEdge(
                        source,
                        target,
                        type,
                        name,
                        vertexSize) :
                null;
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
