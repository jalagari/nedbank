import { createLabel, createLongDescHTML, createQuestionMarkHTML, createWidgetWrapper, renderChildren } from '../../libs/afb-builder.js';
import { subscribe } from '../../libs/afb-interaction.js';
import { Constants } from '../../libs/constants.js';

export class Panel {
  blockName = Constants.PANEL;

  block;

  element;

  model;

  constructor(block, model) {
    this.block = block;
    this.model = model;
  }

  renderField = (state) => {
    const element = document.createDocumentFragment();

    const label = createLabel(state, this.blockName);
    label.tabIndex = label.textContent ? 0 : -1;

    const longDesc = createLongDescHTML(state, this.blockName);
    const help = createQuestionMarkHTML(state, this.blockName);

    if (label) { element.appendChild(label); }
    if (longDesc) { element.appendChild(longDesc); }
    if (help) { element.appendChild(help); }

    return element;
  };

  async render() {
    const state = this.model;

    this.element = this.renderField(state);
    await renderChildren(state?.items, this.element);
    if (state.name || state.dataName) {
      this.block.classList.add(state.name || state.dataName);
    }
    if (state?.name) {
      this.block.setAttribute('name', state.name);
    }
    this.block.appendChild(this.element);
    //subscribe(this.model, this.element);
  }
}

export default async function decorate(block, model) {
  const panel = new Panel(block, model);
  await panel.render();
}
