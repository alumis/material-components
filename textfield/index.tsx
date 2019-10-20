import { Component, createNode, Attributes, generateHTMLElementId, appendCleanCallback } from "@alumis/observables/src/JSX";
createNode;
import { Observable, isObservable, co, ComputedObservable, ModifiableObservable, o } from "@alumis/observables/src/Observable";
import { IconName, Icon } from "../icon";
import { MDCTextField, MDCTextFieldHelperText } from "@material/textfield";

// CSS

import "@material/textfield/mdc-text-field";
import "@material/textfield/icon/mdc-text-field-icon";
import "@material/textfield/helper-text/mdc-text-field-helper-text";

export class TextField extends Component<HTMLDivElement> {

    constructor(attrs: TextFieldAttributes) {

        super();

        if (attrs) {

            var disabled = attrs.disabled;

            var type = attrs.type;
            var autocomplete = attrs.autocomplete;
            var fullWidth = attrs.fullWidth;
            var helperText = attrs.helperText;
            var characterCounter = attrs.characterCounter;
            var label = attrs.label;
            var leadingIcon = attrs.leadingIcon;
            var outlined = attrs.outlined;
            var textarea = attrs.textarea;
            var trailingIcon = attrs.trailingIcon;

            var value = attrs.value;
            var invalidFeedback = attrs.invalidFeedback;

            delete attrs.disabled;

            delete attrs.type;
            delete attrs.autocomplete;
            delete attrs.fullWidth;
            delete attrs.helperText;
            delete attrs.characterCounter;
            delete attrs.label;
            delete attrs.leadingIcon;
            delete attrs.outlined;
            delete attrs.textarea;
            delete attrs.trailingIcon;

            delete attrs.value;
            delete attrs.invalidFeedback;
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

        let innerNode = <div class="mdc-text-field">
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

        function initializeIcon(icon: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName) {
            if (typeof icon === "string") {
                icon = <Icon name={icon} />;
                (icon as Icon).node.classList.add("mdc-text-field__icon");
            }
            else if (icon instanceof Component)
                icon.node.classList.add("mdc-text-field__icon");
            else if (icon)
                icon.classList.add("mdc-text-field__icon");
            return icon;
        }

        if (disabled)
            bindDisabled(innerNode, this.inputElement, disabled);

        if (outlined)
            innerNode.classList.add("mdc-text-field--outlined");

        if (fullWidth)
            innerNode.classList.add("mdc-text-field--fullwidth");

        if (!label)
            innerNode.classList.add("mdc-text-field--no-label");

        if (leadingIcon)
            innerNode.classList.add("mdc-text-field--with-leading-icon");

        if (trailingIcon)
            innerNode.classList.add("mdc-text-field--with-trailing-icon");

        if (autocomplete !== false && type) {
            this.inputElement.autocomplete = type;
            if (!this.inputElement.id)
                this.inputElement.id = generateHTMLElementId();
            if (!this.inputElement.name)
                this.inputElement.name = type;
        }

        if (value instanceof ComputedObservable) {
            appendCleanCallback(this.inputElement, (this.valueAsObservable = value).subscribeInvoke(n => { this.inputElement.value = n !== null && n !== undefined ? n : ""; }).unsubscribeAndRecycle);
            this.inputElement.readOnly = true;
        }

        else if (value instanceof ModifiableObservable) {
            let observableSubscription = (this.valueAsObservable = value).subscribeInvoke(n => { this.inputElement.value = n !== null && n !== undefined ? n : ""; });
            appendCleanCallback(this.inputElement, observableSubscription.unsubscribeAndRecycle);
            this.inputElement.addEventListener("input", () => { (this.valueAsObservable as ModifiableObservable<any>).setValueDontNotifyMe(this.inputElement.value, observableSubscription); });
        }

        else if (typeof value === "function") {
            let computedObservable = co(value);
            (this.valueAsObservable = computedObservable).subscribeInvoke(n => { this.inputElement.value = n !== null && n !== undefined ? n : ""; });
            appendCleanCallback(this.inputElement, computedObservable.dispose);
            this.inputElement.readOnly = true;
        }

        else {
            let observable = o(value) as Observable<string>;
            let observableSubscription = (this.valueAsObservable = observable).subscribeInvoke(n => { this.inputElement.value = n !== null && n !== undefined ? n : ""; });
            appendCleanCallback(this.inputElement, observable.dispose);
            this.inputElement.addEventListener("input", () => { (this.valueAsObservable as ModifiableObservable<any>).setValueDontNotifyMe(this.inputElement.value, observableSubscription); });
        }

        if (invalidFeedback)
            this.invalidFeedback = invalidFeedback;
        else appendCleanCallback(innerNode, (this.invalidFeedback = o(null)).dispose);

        this.node = <div {...attrs}>
            {innerNode}
            <div class="mdc-text-field-helper-line">
                <div class="mdc-text-field-helper-text">{() => {
                    let invalidFeedback = this.invalidFeedback.value;
                    let result: string;
                    if (invalidFeedback) {
                        if (isObservable(invalidFeedback))
                            result = (invalidFeedback as Observable<string>).value;
                        else if (typeof invalidFeedback === "function")
                            result = invalidFeedback();
                        else result = invalidFeedback as string;
                    }
                    else if (helperText) {
                        if (isObservable(helperText))
                            result = (helperText as Observable<string>).value;
                        else if (typeof helperText === "function")
                            result = helperText();
                        else result = helperText as string;
                    }
                    return result !== null && result !== undefined ? result : "";
                }}
                </div>
                {characterCounter ? <div class="mdc-text-field-character-counter">{characterCounter}</div> : null}
            </div>
        </div>;

        (this.mdcComponent = new MDCTextField(innerNode)).useNativeValidation = false;

        let mdcTextFieldHelperText = this.mdcComponent["helperText_"] as MDCTextFieldHelperText;

        let subscription = this.invalidFeedback.subscribeInvoke(n => {
            mdcTextFieldHelperText.foundation.setValidation(!!n);
            this.mdcComponent.valid = !n;
        });

        if (invalidFeedback)
            appendCleanCallback(innerNode, subscription.unsubscribeAndRecycle);
    }

    mdcComponent!: MDCTextField;
    inputElement: HTMLInputElement;

    valueAsObservable: Observable<string>;
    invalidFeedback: Observable<string | Observable<string> | (() => string)>;

    dispose() {
        this.mdcComponent.destroy();
    }
}


export interface TextFieldAttributes extends Attributes {

    type?: TextFieldType;
    autocomplete?: boolean;
    fullWidth?: boolean;
    helperText?: string | Observable<string> | (() => string);
    characterCounter?: string | Observable<string> | (() => string);
    label?: string | Observable<string> | (() => string);
    leadingIcon?: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName;
    outlined?: boolean;
    textarea?: boolean;
    trailingIcon?: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName;

    value?: string | Observable<string> | (() => string);
    invalidFeedback?: Observable<string | Observable<string> | (() => string)>;
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