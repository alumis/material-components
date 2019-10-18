import { Component, createNode, Attributes, generateHTMLElementId, applyAttributes, bindAttribute, appendCleanCallback } from "@alumis/observables/src/JSX";
createNode;
import { Observable, isObservable, co } from "@alumis/observables/src/Observable";
import { IconName, Icon } from "../icon";

import { MDCTextField, MDCTextFieldFoundation, MDCTextFieldIconFoundation } from '@material/textfield';

const cssClasses = MDCTextFieldFoundation.cssClasses;
const iconCssClasses = MDCTextFieldIconFoundation.cssClasses;

export class TextField extends Component<HTMLDivElement> {

    constructor(attrs: TextFieldAttributes) {

        super();

        if (attrs) {

            var disabled = attrs.disabled;

            var type = attrs.type;
            var fullWidth = attrs.fullWidth;
            var helperText = attrs.helperText;
            var characterCounter = attrs.characterCounter;
            var label = attrs.label;
            var leadingIcon = attrs.leadingIcon;
            var outlined = attrs.outlined;
            var textarea = attrs.textarea;
            var trailingIcon = attrs.trailingIcon;

            delete attrs.disabled;

            delete attrs.type;
            delete attrs.fullWidth;
            delete attrs.helperText;
            delete attrs.characterCounter;
            delete attrs.label;
            delete attrs.leadingIcon;
            delete attrs.outlined;
            delete attrs.textarea;
            delete attrs.trailingIcon;
        }

        let inputType: string;

        switch (type) {

            case TextFieldType.CurrentPassword:
            case TextFieldType.NewPassword:
                inputType = "password";
                break;
            case TextFieldType.Email:
                inputType = "email";
                break;
            case TextFieldType.PhoneNumber:
                inputType = "tel";
                break;
            case TextFieldType.Url:
                inputType = "url";
                break;
            default:
                inputType = "text";
                break;
        }

        let inputId = generateHTMLElementId();

        let innerNode = <div class={cssClasses.ROOT}>
            {leadingIcon ? initializeIcon(leadingIcon) : null}
            {this.inputElement = <input type={inputType} id={inputId} class="mdc-text-field__input" />}

            {outlined ?
                <div class="mdc-notched-outline">
                    <div class="mdc-notched-outline__leading"></div>
                    <div class="mdc-notched-outline__notch">
                        {label ? <label class="mdc-floating-label" for={inputId}>{label}</label> : null}
                    </div>
                    <div class="mdc-notched-outline__trailing"></div>
                </div> : (label ? <label class="mdc-floating-label" for={inputId}>{label}</label> : null)}
            {trailingIcon ? initializeIcon(trailingIcon) : null}
            {!outlined ? <div class="mdc-line-ripple"></div> : null}
        </div> as HTMLDivElement;

        if (disabled)
            bindDisabled(innerNode, this.inputElement, disabled);

        if (outlined)
            innerNode.classList.add(cssClasses.OUTLINED);

        if (fullWidth)
            innerNode.classList.add(cssClasses.FULLWIDTH);

        if (!label)
            innerNode.classList.add(cssClasses.NO_LABEL);

        if (leadingIcon)
            innerNode.classList.add(cssClasses.WITH_LEADING_ICON);

        if (trailingIcon)
            innerNode.classList.add(cssClasses.WITH_TRAILING_ICON);

        this.mdcComponent = new MDCTextField(innerNode);

        this.node = <div {...attrs}>
            {innerNode}
            {helperText || characterCounter ?
                <div class="mdc-text-field-helper-line">
                    {helperText ? <div class="mdc-text-field-helper-text">{helperText}</div> : null}
                    {characterCounter ? <div class="mdc-text-field-character-counter">{characterCounter}</div> : null }
                </div> : null}
        </div>

        function initializeIcon(icon: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName) {
            if (typeof icon === "string") {
                icon = <Icon name={icon} />;
                (icon as Icon).node.classList.add(iconCssClasses.ROOT);
            }
            else if (icon instanceof Component)
                icon.node.classList.add(iconCssClasses.ROOT);
            else if (icon)
                icon.classList.add(iconCssClasses.ROOT);
            return icon;
        }
    }

    mdcComponent!: MDCTextField;
    inputElement: HTMLInputElement;

    dispose() {
        this.mdcComponent.destroy();
    }
}


export interface TextFieldAttributes extends Attributes {

    type?: TextFieldType;
    fullWidth?: boolean;
    helperText?: any | Observable<any> | (() => any);
    characterCounter?: any | Observable<any> | (() => any);
    label?: any | Observable<any> | (() => any);
    leadingIcon?: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName;
    outlined?: boolean;
    textarea?: boolean;
    trailingIcon?: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName;
}

export enum TextFieldType {

    Name = "name",
    HonorificPrefix = "honorific-prefix",
    GivenName = "given-name",
    MiddleName = "additional-name",
    Surname = "family-name",
    HonorificSuffix = "honorific-suffix",
    Nickname = "nickname",
    Email = "email",
    Username = "username",
    CurrentPassword = "current-password",
    NewPassword = "new-password",
    JobTitle = "organization-title",
    Organization = "organization",
    StreetAddress = "street-address",
    AddressLine1 = "address-line1",
    AddressLine2 = "address-line2",
    AddressLine3 = "address-line3",
    PhoneNumber = "tel",
    PhoneNumberCountryCode = "tel-country-code",
    PhoneNumberWithoutCountryCode = "tel-national",
    PhoneNumberAreaCode = "tel-area-code",
    PhoneNumberWithoutAreaCode = "tel-local",
    PhoneNumberExtension = "tel-extension",
    Url = "url"
}

export function bindDisabled(rootElement: HTMLElement, inputElement: HTMLInputElement, expression: boolean | Observable<boolean> | (() => boolean)) {
    function disable() {
        rootElement.classList.add("mdc-text-field--disabled");
        inputElement.disabled = true;
    }
    function enable() {
        rootElement.classList.remove("mdc-text-field--disabled");
        inputElement.disabled = false;
    }
    if (expression) {
        if (expression === true)
            disable();
        else if (isObservable(expression)) {
            appendCleanCallback(rootElement, (expression as Observable<boolean>).subscribeInvoke(n => {
                if (n) {
                    if (n === true)
                        disable();
                    else enable();
                }
                else enable();
            }).unsubscribeAndRecycle);
        }
        else if (typeof expression === "function") {
            let o = co(expression);
            o.subscribeInvoke(n => {
                if (n) {
                    if (n === true)
                        disable();
                    else enable();
                }
                else enable();
            });
            appendCleanCallback(rootElement, o.dispose);
        }
    }
    else enable();
}