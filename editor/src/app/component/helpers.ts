import Core = require('./core');
import Div = Core.Div;
import InputLabel = require('./dumb/inputlabel');

export function wrapInLabel<P>(label: string, ...components: React.ReactElement<any>[])
{
        const props = { name: '', value: label };
        return InputLabel(props, ...components);
}

export function wrapInGroup(...components: React.ReactElement<any>[])
{
        return Div({ className: 'edit-message-group' },
                Div({ className: 'edit-message-group-content' },
                        ...components)
        );
}

export function wrapInSubgroup(...components: React.ReactElement<any>[])
{
        return Div({ className: 'edit-message-subgroup' }, ...components);
}

export function wrapInTitleGroup(
        title: string, ...components: React.ReactElement<any>[])
{
        return Div({ className: 'edit-message-group' },
                Div({ className: 'edit-message-group-title' }, title),
                Div({ className: 'edit-message-group-content' },
                        ...components)
        );
}
