import { getWidget, subscribe } from '../../libs/afb-interaction.js';
import { Constants } from '../../libs/constants.js';
import { getLabelValue } from '../../libs/afb-model.js';
import { createLabel, createLongDescHTML, createQuestionMarkHTML, createWidget, createWidgetWrapper, defaultInputRender } from '../../libs/afb-builder.js';

export class Checkbox {
  blockName = Constants.CHECKBOX;

  block;

  element;

  model;

  constructor(block, model) {
    this.block = block;
    this.model = model;
  }

  addListener() {
    getWidget(this.element)?.addEventListener('change', () => {
      const widget = getWidget(this.element);
      if (widget?.checked) {
        this.model.value = this.model.enum?.[0] || true;
      } else {
        this.model.value = this.model.enum?.[1];
      }
    });
  }

  renderField = (model) => {
    let widget = createWidget(model, this.blockName);
    let label = widget.querySelector("label");
    widget.append(label);
    return widget;
  };

  updateValue = (element, value) => {
    const widget = getWidget(element);
    if (widget) {
      widget.checked = this.model.enum?.[0] === value || value === true;
    }
  };

  render() {
    this.element = this.renderField(this.model);
    this.block.appendChild(this.element);
    this.addListener();
    //subscribe(this.model, this.element, { value: this.updateValue });
  }
}

export default async function decorate(block, model) {
  const checkbox = new Checkbox(block, model);
  checkbox.render();
}
