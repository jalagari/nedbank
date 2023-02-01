import { createWidget, defaultInputRender } from '../../libs/afb-builder.js';
import { getWidget } from '../../libs/afb-interaction.js';
import { Constants } from '../../libs/constants.js';
import { DefaultField } from '../defaultInput.js';

export class Output extends DefaultField {
  blockName = Constants.OUTPUT;

  renderField() {
    let widget = createWidget(this.model, this.blockName);
    let output = defaultInputRender(this.model, this.blockName, "output");
    widget.querySelector("input").replaceWith(output);
    return widget;
  }
}

export default async function decorate(block, model) {
  const radio = new Output(block, model);
  return radio.render();
}
