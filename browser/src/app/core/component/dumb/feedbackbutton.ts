import React = require('react');
import Core = require('../core');
import A = Core.A;

function renderHeader(props: any)
{
        const href = 'https://docs.google.com/forms/d/11eFwJmswpetWYbOS6hbshPTPSzdCuCENsB_5nMVCLMM/viewform';
        const target ='_blank';
        const text = 'Give feedback';
        return A({ className: 'feedback-button', href, target }, text);
}

const Header = React.createFactory(renderHeader);

export = Header;
