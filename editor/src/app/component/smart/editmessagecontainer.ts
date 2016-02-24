/// <reference path="../dumb/editmessage.ts" />

module Component {
        interface EditMessageContainerInt {
                name: string,
                store: Im.Store;
        };
        export type EditMessageContainerData = Immutable.Record.IRecord<EditMessageContainerInt>;
        export const EditMessageContainerData = Immutable.Record<EditMessageContainerInt>({
                name: '',
                store: Im.Store(),
        }, 'EditMessageContainer');

        type EditMessageContainerProps = Flux.Props<EditMessageContainerData>;

        function render (props: EditMessageContainerProps)
        {
                const data = props.data;
                const name = data.name;

                const onDeleteLocal = () => onDelete(name);
                const onSetNameScratchpadLocal = (newName: string) =>
                        onSetNameScratchpad(name, newName);
                const onSetNameLocal = () => onSetName(name);
                const onSetSubjectNameLocal = (subjectName: string) =>
                        onSetSubjectName(name, subjectName);
                const onSetStringLocal = (name: string, value: string) =>
                        onSetString(name, value);
                const onSetEndGameLocal = (endGame: boolean) =>
                        onSetEndGame(name, endGame);
                const onSetEncryptedLocal = (encrypted: boolean) =>
                        onSetEncrypted(name, encrypted);
                const onSetChildrenLocal = (delays: Im.MessageDelays) =>
                        onSetChildren(name, delays);
                const onSetFallbackLocal = (delay: Im.MessageDelay) =>
                        onSetFallback(name, delay);

                const editMessageData = EditMessageData({
                        name: data.name,
                        store: data.store,
                        onDelete: onDeleteLocal,
                        onSetNameScratchpad: onSetNameScratchpadLocal,
                        onSetName: onSetNameLocal,
                        onSetSubjectName: onSetSubjectNameLocal,
                        onSetString: onSetStringLocal,
                        onSetEndGame: onSetEndGameLocal,
                        onSetEncrypted: onSetEncryptedLocal,
                        onSetChildren: onSetChildrenLocal,
                        onSetFallback: onSetFallbackLocal,
                });
                return EditMessage(editMessageData);
        }

        export const EditMessageContainer = Flux.createFactory(render, 'EditMessageContainer');

        function onDelete (name: string)
        {
                const action = Action.deleteMessage(name);
                Flux.handleAction(action);
        }

        function onSetNameScratchpad (
                messageName: string, newName: string)
        {
                const action = Action.setEditedMessageName({
                        name: messageName,
                        value: newName,
                });
                Flux.handleAction(action);
        }

        function onSetName (messageName: string)
        {
                const action = Action.setMessageName({
                        name: messageName,
                        value: null,
                });
                Flux.handleAction(action);
        }

        function onSetSubjectName (messageName: string, newSubject: string)
        {
                const action = Action.setMessageSubject({
                        name: messageName,
                        value: newSubject,
                });
                Flux.handleAction(action);
        }

        export function onSetString (
                stringName: string, value: string)
        {
                const action = Action.setString({
                        name: stringName,
                        value: value,
                });
                Flux.handleAction(action);
        }

        function onSetEndGame (messageName: string, newEndGame: boolean)
        {
                const action = Action.setMessageEndGame({
                        name: messageName,
                        value: newEndGame,
                });
                Flux.handleAction(action);
        }

        function onSetEncrypted (messageName: string, newEncrypted: boolean)
        {
                const action = Action.setMessageEncrypted({
                        name: messageName,
                        value: newEncrypted,
                });
                Flux.handleAction(action);
        }

        function onSetChild (
                message: Im.Message,
                delay: Im.MessageDelay,
                index: number)
        {
                const children = message.children;
                const newChildren = children.set(index, delay);
                onSetChildren(message.name, newChildren);
        }

        function onSetChildren (
                messageName: string,
                delays: Immutable.List<Im.MessageDelay>)
        {
                const action = Action.setMessageChildren({
                        name: messageName,
                        value: delays,
                });
                Flux.handleAction(action);
        }

        function onAddChild (message: Im.Message)
        {
                const newChild = Im.MessageDelay();
                const children = message.children;
                const newChildren = children.push(newChild);
                onSetChildren(message.name, newChildren);
        }

        function onRemoveChild (message: Im.Message, index: number)
        {
                const children = message.children;
                const newChildren = children.delete(index);
                onSetChildren(message.name, newChildren);
        }

        function onSetFallback (messageName: string, newDelay: Im.MessageDelay)
        {
                const action = Action.setMessageFallback({
                        name: messageName,
                        value: newDelay,
                });
                Flux.handleAction(action);
        }

        function onAddFallback (messageName: string)
        {
                const newDelay = Im.MessageDelay();
                onSetFallback(messageName, newDelay);
        }

        function onRemoveFallback (messageName: string)
        {
                onSetFallback(messageName, null);
        }
}

