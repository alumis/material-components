import { Component, createNode, Attributes } from "@alumis/observables/src/JSX";
createNode;
import { MDCRipple } from "@material/ripple";
import { CSS_CLASSES } from './constant';

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
            {!trailingIcon ? addIconClass(icon) : null}
            <span class={CSS_CLASSES.LABEL}>{children}</span>
            {trailingIcon ? addIconClass(trailingIcon) : null}
        </TagName>).classList.add(CSS_CLASSES.ROOT);

        function addIconClass(icon: HTMLElement | SVGElement | Component<HTMLElement | SVGElement>) {
            if (icon instanceof Component)
                icon.node.classList.add(CSS_CLASSES.ICON);
            else if (icon)
                icon.classList.add(CSS_CLASSES.ICON);
            return icon;
        }

        if (!(attrs && "href" in attrs))
            this.node.type = submits ? "submit" : "button";

        if (raised)
            this.node.classList.add(CSS_CLASSES.RAISED);

        if (unelevated)
            this.node.classList.add(CSS_CLASSES.UNELEVATED);

        if (outlined)
            this.node.classList.add(CSS_CLASSES.OUTLINED);

        if (dense)
            this.node.classList.add(CSS_CLASSES.DENSE);

        MDCRipple.attachTo(this.node);
    }
}

export interface ButtonAttributes extends Attributes {

    submits?: boolean;
    raised?: boolean;
    unelevated?: boolean;
    outlined?: boolean;
    dense?: boolean;
    icon?: HTMLElement | SVGElement | Component<HTMLElement | SVGElement>;
    trailingIcon?: HTMLElement | SVGElement | Component<HTMLElement | SVGElement>;
}