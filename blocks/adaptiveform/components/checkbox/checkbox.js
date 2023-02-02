import { Constants } from '../../libs/constants.js';
import { createFormElement } from '../../libs/afb-builder.js';

export class Checkbox {
  blockName = Constants.CHECKBOX;

  block;

  element;

  model;

  constructor(block, model) {
    this.block = block;
    this.model = model;
  }

  getWidget() {
    return this.element.querySelector(`[class$='${Constants.WIDGET}']`);
  }

  addListener() {
    this.getWidget().addEventListener('change', () => {
      const widget = this.getWidget();
      if (widget?.checked) {
        this.model.value = this.model.enum?.[0] || true;
      } else {
        this.model.value = this.model.enum?.[1];
      }
    });
  }

  renderField = (model) => {
    const element = createFormElement(model);
    const label = element.querySelector('label');
    element.append(label);
    return element;
  };

  updateValue = (element, value) => {
    const widget = this.getWidget();
    if (widget) {
      widget.checked = this.model.enum?.[0] === value || value === true;
    }
  };

  render(model) {
    this.element = this.renderField(model);
    this.addListener();
    // subscribe(this.model, this.element, { value: this.updateValue });
    return this.element;
  }
}

export default async function decorate(block, model) {
  const checkbox = new Checkbox(block, model);
  block.append(checkbox.render(model));
  return block;
}
