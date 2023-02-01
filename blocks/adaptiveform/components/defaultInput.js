import { getWidget, defaultInputRender, createWidget } from '../libs/afb-builder.js';
import { Constants } from '../libs/constants.js';

export class DefaultField {
  blockName = 'afb-text';
  block;
  model;

  constructor(block, model) {
    this.block = block;
    this.model = model;
  }

  addListener() {
    if (this.block) {
      const widget = getWidget(this.block);
      widget?.addEventListener('blur', (e) => {
        this.model.value = e.target.value;
      });
    }
  }

  renderField() {
    if (this.model.fieldType === 'hidden') {
      return defaultInputRender(this.model, this.blockName);
    } else {
      return createWidget(this.model, this.blockName);
    }
  }

  render() {
    this.block.append(this.renderField());
    if (this.model.fieldType !== 'hidden' || this.model.fieldType !== 'output') {
      this.addListener();
    }
    return this.block;
  }
}

export default async function decorate(block, model) {
  const textinput = new DefaultField(block, model);
  return textinput.render();
}
