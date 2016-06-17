import React = require('react');
import Core = require('../core');
import Div = Core.Div

interface FeedbackButtonProps extends React.Props<any> {
        openExternal: (link: string) => void;
}

function renderFeedbackButton(props: FeedbackButtonProps)
{
        const href = 'https://docs.google.com/forms/d/11eFwJmswpetWYbOS6hbshPTPSzdCuCENsB_5nMVCLMM/viewform';
        const onClick = () => props.openExternal(href);
        const target ='_blank';
        const text = 'Give feedback';
        return Div({ className: 'feedback-button', onClick }, text);
}

const FeedbackButton = React.createFactory(renderFeedbackButton);

export = FeedbackButton;
