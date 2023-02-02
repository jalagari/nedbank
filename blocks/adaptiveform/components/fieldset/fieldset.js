import {
  appendChild,
  createLabel, createLongDescHTML, createQuestionMarkHTML, renderChildren,
} from '../../libs/afb-builder.js';
import { subscribe } from '../../libs/afb-interaction.js';
import { Constants } from '../../libs/constants.js';

export class Panel {
  blockName = Constants.PANEL;

  element;

  renderField = (state) => {
    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('afb-fieldset', state.name);
    fieldset.setAttribute('name', state.name);
    const label = createLabel(state?.label, 'fieldset', state?.id, 'legend');
    if (label) {
      label.tabIndex = label.textContent ? 0 : -1;
      fieldset.appendChild(label);
    }
    appendChild(fieldset, createLongDescHTML(state?.description));
    appendChild(fieldset, createQuestionMarkHTML(state?.tooltip));

    return fieldset;
  };

  async render(model) {
    const state = model;

    this.element = this.renderField(state);
    await renderChildren(state?.items, this.element);

    return this.element;
    // subscribe(this.model, this.element);
  }
}

export default async function decorate(block, model) {
  const panel = new Panel(model);
  const element = await panel.render(model);
  // element.classList.add(block.classList);
  return element;
}
