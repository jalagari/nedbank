import { createFormElement } from '../../libs/afb-builder.js';
import { Constants } from '../../libs/constants.js';

export class Output {
  blockName = Constants.OUTPUT;

  render(model) {
    const element = createFormElement(model, () => {
      const output = document.createElement('output');
      output.value = model.value;
      return output;
    });
    return element;
  }
}

export default async function decorate(block, model) {
  const component = new Output();
  block.append(component.render(model));
  return block;
}
