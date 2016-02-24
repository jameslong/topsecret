///<reference path='math.ts'/>

module Im {
        export enum Type {
                Fallback,
                Child,
                ReplyOption,
        }

        interface EdgeInt {
                name: string;
                source: string;
                target: string;
                line: Line;
                type: Type;
        };
        export type Edge = Immutable.Record.IRecord<EdgeInt>;
        export const Edge = Immutable.Record<EdgeInt>({
                name: '',
                source: '',
                target: '',
                line: Line(),
                type: Type.Fallback,
        }, 'Edge');

        export type Edges = Immutable.List<Edge>;

        export function createEdges (
                messages: Messages, vertexSize: Coord)
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
                messages: Messages,
                message: Message,
                vertexSize: Coord)
        {
                const fallback = createFallbackEdge(
                        messages, message, vertexSize);
                const replyOptions =
                        createReplyOptionEdges(messages, message, vertexSize);
                const children =
                        createChildrenEdges(messages, message, vertexSize);
                const temp =
                        concat(children, replyOptions).push(fallback);
                return temp.filter(edge => edge !== null);
        }

        function createEdgeName (
                sourceName: string, type: Type, index: number)
        {
                return `${sourceName}_${type}_${index}`;
        }

        function createFallbackEdge (
                messages: Messages,
                source: Message,
                vertexSize: Coord)
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
                messages: Messages,
                source: Message,
                vertexSize: Coord)
        {
                return map(source.replyOptions,
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
                messages: Messages,
                source: Message,
                vertexSize: Coord)
                : Immutable.List<Edge>
        {
                return map(source.children,
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
                messages: Messages,
                source: Message,
                messageDelay: MessageDelay,
                type: Type,
                name: string,
                vertexSize: Coord)
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
                source: Message,
                target: Message,
                type: Type,
                name: string,
                vertexSize: Coord)
        {
                const sourceName = source.name;
                const targetName = target.name;

                const sourcePosition = add(source.position, vertexSize);
                const line = Line({
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
