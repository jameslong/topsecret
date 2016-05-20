import ActionCreators = require('./action/actioncreators');
import Map = require('./../../../core/src/app/utils/map');
import Message = require('./../../../core/src/app/message');
import MathUtils = require('./math');
import EditorMessage = require('./editormessage');
import MessageDelay = require('./messagedelay');
import Narrative = require('./narrative');
import Redux = require('./redux/redux');
import ReplyOption = require('./../../../core/src/app/replyoption');

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
        messages: EditorMessage.EditorMessages,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>,
        vertexSize: MathUtils.Coord)
{
        let result: Edge[] = [];

        Map.forEach(messages, source => {
                const edges = createMessageEdges(
                        messages, replyOptions, source, vertexSize);
                result.push(...edges);
        });

        return result;
}

function createMessageEdges (
        messages: EditorMessage.EditorMessages,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>,
        message: EditorMessage.EditorMessage,
        vertexSize: MathUtils.Coord)
{
        const fallback = createFallbackEdge(messages, message, vertexSize);
        const replyOptionEdges = createReplyOptionEdges(
                messages, replyOptions, message, vertexSize);
        const children = createChildEdges(messages, message, vertexSize);
        return fallback.concat(children, replyOptionEdges);
}

function createEdgeName (sourceName: string, type: Type, index: number)
{
        return `${sourceName}_${type}_${index}`;
}

function createFallbackEdge (
        messages: EditorMessage.EditorMessages,
        source: EditorMessage.EditorMessage,
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
        messages: EditorMessage.EditorMessages,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>,
        source: EditorMessage.EditorMessage,
        vertexSize: MathUtils.Coord)
{
        const result: Edge[] = [];
        const sourceOptions = replyOptions[source.replyOptions] || [];
        const options = sourceOptions.reduce<Message.ReplyThreadDelay[]>((result, option) => {
                result.push(...option.messageDelays);
                return result;
        }, []);
        return options.reduce((result, option, index) => {
                Map.exists(messages, option.name) ?
                        result.push(createReplyOptionEdge(
                                messages, source, option, index, vertexSize)) :
                        result;
                return result;
        }, result);
}

function createReplyOptionEdge (
        messages: EditorMessage.EditorMessages,
        source: EditorMessage.EditorMessage,
        option: Message.ReplyThreadDelay,
        index: number,
        vertexSize: MathUtils.Coord)
{
        const type = Type.ReplyOption;
        const name = createEdgeName(source.name, type, index);
        const target = messages[option.name];

        return createEdge(source, target, type, name, vertexSize);
}

function createChildEdges (
        messages: EditorMessage.EditorMessages,
        source: EditorMessage.EditorMessage,
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
        messages: EditorMessage.EditorMessages,
        source: EditorMessage.EditorMessage,
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
        source: EditorMessage.EditorMessage,
        target: EditorMessage.EditorMessage,
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
