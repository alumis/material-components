import { Component, createNode, Attributes } from "@alumis/observables/src/JSX";
createNode;

export class Icon extends Component<HTMLElement> {

    constructor(attrs: IconAttributes) {

        super();

        if (attrs) {

            var name = attrs.name;

            delete attrs.name;
        }

        this.node = (<i {...attrs}>{name}</i>).classList.add("material-icons");
    }
}

export interface IconAttributes extends Attributes {

    name: string; // https://material.io/resources/icons/?style=baseline
}