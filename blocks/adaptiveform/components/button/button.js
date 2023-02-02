import { subscribe } from '../../libs/afb-interaction.js';
import { Constants } from '../../libs/constants.js';

export class Button {
  blockName = Constants.BUTTON;

  block;

  element;

  model;

  constructor(block, model) {
    this.block = block;
    this.model = model;
  }

  addListener() {
    this.element?.addEventListener('click', () => {
      // this.model.dispatch({
      //   action: 'click',
      // });
    });
  }

  renderField = () => {
    const state = this.model;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = state?.id;
    button.className = this.blockName;
    button.title = state?.tooltip;
    button.dataset.cmpVisible = `${state?.visible === true}`;
    button.dataset.cmpEnabled = `${state?.enabled === true}`;
    button.setAttribute('aria-label', state?.label?.value ? ` ${state?.label?.value}` : '');

    const span = document.createElement('span');
    span.className = `${this.blockName}__text`;
    span.textContent = state?.label?.value || '';

    button.appendChild(span);
    return button;
  };

  render(model) {
    this.element = this.renderField(model);
    this.addListener();
    // subscribe(this.model, this.element);
    return this.element;
  }
}

export default async function decorate(block, model) {
  const button = new Button(block, model);
  block.append(button.render(model));
  return block;
}
