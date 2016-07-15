/// <reference path="../../../../typings/react/react.d.ts"/>
import React = require('react');
import TextComponent = require('./text');
import TextAreaInput = require('./textareainput');
import TextList = require('./textlist');

interface TextProps extends React.Props<any> {
        placeholder: string;
        value: string;
        onChange: (value: string) => void;
        list?: string;
        className?: string;
};

interface TextAreaProps extends React.Props<any> {
        placeholder: string;
        value: string;
        onChange: (value: string) => void;
        className?: string;
};

interface TextListProps {
        placeholder: string;
        values: string[];
        onChange: (values: string[]) => void;
        className?: string;
};

export function createValidatedText (props: TextProps, valid: boolean)
{
        return createValidatedComponent(props, TextComponent, valid);
}

export function createValidatedTextList (
        props: TextListProps, valid: boolean)
{
        return createValidatedComponent(props, TextList, valid);
}

export function createValidatedTextArea (
        props: TextAreaProps, valid: boolean)
{
        return createValidatedComponent(props, TextAreaInput, valid);
}

export function createValidatedComponent<U extends { className?: string; }> (
        props: U,
        createComponent: React.Factory<U>,
        valid: boolean)
{
        if (!valid) {
                props.className = 'invalid';
        }
        return createComponent(props);
}
