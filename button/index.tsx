import { Component, createNode, Attributes } from "@alumis/observables/src/JSX";
createNode;
import { MDCRipple } from "@material/ripple";
import { IconName, Icon } from "../icon";

// CSS

import "@material/ripple/mdc-ripple";
import "@material/button/mdc-button";

export class Button extends Component<HTMLAnchorElement | HTMLButtonElement> {

    constructor(attrs: ButtonAttributes, children: any[]) {

        super();

        if (attrs) {

            var submits = attrs.submits;
            var raised = attrs.raised;
            var unelevated = attrs.unelevated;
            var outlined = attrs.outlined;
            var dense = attrs.dense;
            var icon = attrs.icon;
            var trailingIcon = attrs.trailingIcon;

            delete attrs.submits;
            delete attrs.raised;
            delete attrs.unelevated;
            delete attrs.outlined;
            delete attrs.dense;
            delete attrs.icon;
            delete attrs.trailingIcon;
        }

        let TagName = attrs && attrs.href ? "a" : "button";

        (this.node = <TagName {...attrs}>
            {!trailingIcon ? initializeIcon(icon) : null}
            <span class={"mdc-button__label"}>{children}</span>
            {trailingIcon ? initializeIcon(trailingIcon) : null}
        </TagName> as HTMLAnchorElement | HTMLButtonElement).classList.add("mdc-button");

        function initializeIcon(icon: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName) {
            if (typeof icon === "string") {
                icon = <Icon name={icon} />;
                (icon as Icon).node.classList.add("mdc-button__icon");
            }
            else if (icon instanceof Component)
                icon.node.classList.add("mdc-button__icon");
            else if (icon)
                icon.classList.add("mdc-button__icon");
            return icon;
        }

        if (!(attrs && "href" in attrs))
            this.node.type = submits ? "submit" : "button";

        if (raised)
            this.node.classList.add("mdc-button--raised");

        if (unelevated)
            this.node.classList.add("mdc-button--unelevated");

        if (outlined)
            this.node.classList.add("mdc-button--outlined");

        if (dense)
            this.node.classList.add("mdc-button--dense");

        MDCRipple.attachTo(this.node);
    }
}

export interface ButtonAttributes extends Attributes {

    submits?: boolean;
    raised?: boolean;
    unelevated?: boolean;
    outlined?: boolean;
    dense?: boolean;
    icon?: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName;
    trailingIcon?: HTMLElement | SVGElement | Component<HTMLElement | SVGElement> | string | IconName;
}