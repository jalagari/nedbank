import { subscribe } from "../../libs/afb-interaction.js";
import { Constants } from "../../libs/constants.js";
import * as builder from "../../libs/afb-builder.js";

export class Panel {
    blockName = Constants.PANEL;

    block;
    element;
    model;

    constructor(block, model) {
        this.block = block;
        this.model = model;
    }

    async renderChildren(parent, state) {
        let fields = state?.items;
        let length = fields ? fields.length : 0;

        for(let i = 0; i< length; i++) {
            let field = fields[i];
            let fieldModel = adaptiveform.model?.getElement(field.id);
            let element = await builder?.default?.getRender(fieldModel);

            parent.append(element);
            // @todo trigger add event
        }
    }

    renderField = (state) => {
        let element = builder?.default?.createWidgetWrapper(state, this.blockName);
        state?.name && element.setAttribute("name", state.name);

        let child = document.createElement("div");
        child.className = this.blockName + "__widget";
        child.tabIndex = state?.value ? 0 : -1;
        child.textContent = state?.value;
        element.append(child);
        return element;
    }

    async render() {
        let state = this.model.getState();

        this.element = this.renderField(state);
        await this.renderChildren(this.element, state);

        this.block.appendChild(this.element);
        subscribe(this.model, this.element);
    }
}

export default async function decorate(block, model) {
    let panel = new Panel(block, model);
    await panel.render();
}