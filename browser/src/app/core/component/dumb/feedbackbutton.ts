import React = require('react');
import Core = require('../core');
import Div = Core.Div

interface FeedbackButtonProps extends React.Props<any> {
        openExternal: (link: string) => void;
}

function renderFeedbackButton(props: FeedbackButtonProps)
{
        const href = 'https://docs.google.com/forms/d/1dgz3smQ1AkvH6sRLPVC6vSHFP2mYq_KYPd4CmKS-w60/viewform';
        const onClick = () => props.openExternal(href);
        const target ='_blank';
        const text = 'Give feedback';
        return Div({ className: 'feedback-button', onClick }, text);
}

const FeedbackButton = React.createFactory(renderFeedbackButton);

export = FeedbackButton;
