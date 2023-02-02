import { createFormElement, defaultInputRender } from '../../libs/afb-builder.js';
import { subscribe } from '../../libs/afb-interaction.js';

export class TextArea {
  blockName = 'cmp-adaptiveform-textinput';

  /**
     * @param {any} state FieldJson
     * @param {string} bemBlock
     *
     * @return {Element}
     */
  createInputHTML = () => defaultInputRender(this.model?.getState(), 'textarea');

  render(model) {
    this.element = createFormElement(model, this.createInputHTML);
    this.addListener();
    subscribe(this.model, this.element);
    return this.element;
  }
}

export default async function decorate(block, model) {
  const textinput = new TextArea(block, model);
  const element = textinput.render(model);
  block.appendChild(element);
  return block;
}
