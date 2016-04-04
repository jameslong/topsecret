///<reference path='math.ts'/>

module Edge {
        export enum Type {
                Fallback,
                Child,
                ReplyOption,
        }

        interface EdgeInt {
                name: string;
                source: string;
                target: string;
                line: MathUtils.Line;
                type: Type;
        };
        export type Edge = Immutable.Record.IRecord<EdgeInt>;
        export const Edge = Immutable.Record<EdgeInt>({
                name: '',
                source: '',
                target: '',
                line: MathUtils.Line(),
                type: Type.Fallback,
        }, 'Edge');

        export type Edges = Immutable.List<Edge>;

        export function createEdges (
                messages: Narrative.Messages, vertexSize: MathUtils.Coord)
        {
                const edgeList = Immutable.List<Edge>();

                return edgeList.withMutations(result => {
                        messages.forEach(source => {
                                const edges = createMessageEdges(
                                        messages, source, vertexSize);
                                edges.forEach(edge => result.push(edge));
                        })
                });
        }

        function createMessageEdges (
                messages: Narrative.Messages,
                message: Message.Message,
                vertexSize: MathUtils.Coord)
        {
                const fallback = createFallbackEdge(
                        messages, message, vertexSize);
                const replyOptions =
                        createReplyOptionEdges(messages, message, vertexSize);
                const children =
                        createChildrenEdges(messages, message, vertexSize);
                const temp =
                        Helpers.concat(children, replyOptions).push(fallback);
                return temp.filter(edge => edge !== null);
        }

        function createEdgeName (
                sourceName: string, type: Type, index: number)
        {
                return `${sourceName}_${type}_${index}`;
        }

        function createFallbackEdge (
                messages: Narrative.Messages,
                source: Message.Message,
                vertexSize: MathUtils.Coord)
        {
                const fallback = source.fallback;
                const type = Type.Fallback;
                const name = createEdgeName(source.name, type, 0);
                return fallback ?
                        createMessageDelayEdge(
                                messages,
                                source,
                                fallback,
                                type,
                                name,
                                vertexSize) :
                        null;
        }

        function createReplyOptionEdges (
                messages: Narrative.Messages,
                source: Message.Message,
                vertexSize: MathUtils.Coord)
        {
                return Helpers.map(source.replyOptions,
                        (option, index) => {
                                const type = Type.ReplyOption;
                                const name = createEdgeName(
                                        source.name, type, index);

                                return createMessageDelayEdge(
                                        messages,
                                        source,
                                        option.messageDelay,
                                        type,
                                        name,
                                        vertexSize);
                                }
                );
        }

        function createChildrenEdges (
                messages: Narrative.Messages,
                source: Message.Message,
                vertexSize: MathUtils.Coord)
                : Immutable.List<Edge>
        {
                return Helpers.map(source.children,
                        (child, index) => {
                                const type = Type.Child;
                                const name = createEdgeName(
                                        source.name, type, index);
                                return createMessageDelayEdge(
                                        messages,
                                        source,
                                        child,
                                        type,
                                        name,
                                        vertexSize);
                        }
                );
        }

        function createMessageDelayEdge (
                messages: Narrative.Messages,
                source: Message.Message,
                messageDelay: Message.MessageDelay,
                type: Type,
                name: string,
                vertexSize: MathUtils.Coord)
        {
                const target = messages.get(messageDelay.name);
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
                vertexSize: MathUtils.Coord)
        {
                const sourceName = source.name;
                const targetName = target.name;

                const sourcePosition = MathUtils.add(source.position, vertexSize);
                const line = MathUtils.Line({
                        start: sourcePosition,
                        end: target.position,
                });
                return Edge({
                        name: name,
                        source: sourceName,
                        target: targetName,
                        line: line,
                        type: type,
                });
        }
}
