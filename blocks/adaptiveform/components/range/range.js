import { defaultInputRender, createFormElement } from '../../libs/afb-builder.js';
import { Constants } from '../../libs/constants.js';

export class Range {
  addListener() {
    if (this.element) {
      const widget = this.block.querySelector(`[class$='${Constants.widget}']`);

      widget?.addEventListener('change', (e) => {
        const hover = this.element.querySelector(`.${this.blockName}__widget-value`);

        this.model.value = e.target.value;
        const state = this.model?.getState();
        this.#updateView(state, hover, e.target);
      });
    }
  }

  /**
     * updates the hover as per widget value and style the hover accordingly.
     * @param {*} state
     * @param {HTMLSpanElement} hover
     * @param {HTMLInputElement} widget
     */
  // eslint-disable-next-line class-methods-use-this
  #updateView(state, hover, widget) {
    try {
      const min = Number(state.minimum) || 0;
      const max = Number(state.maximum) || 1;
      const value = Number(state.value) || 0;
      const step = Number(state.step) || 1;

      const totalSteps = Math.ceil((max - min) / step);
      const currStep = Math.ceil((value - min) / step);

      if (hover) {
        hover.textContent = value === 0 ? '6 months' : state.displayValue;
        hover.style.left = `calc(${currStep}*(100%/${totalSteps + 1}))`;
      }
      widget.setAttribute('style', `background-image: linear-gradient(to right, #78be20 ${100 * (currStep / totalSteps)}%, #C5C5C5 ${100 * (currStep / totalSteps)}%)`);
    } catch (err) {
      console.error(err);
    }
  }

  format(value, state) {
    return value === 0 ? '6 months' : `${value} ${state.displayFormat}`;
  }

  renderInput = (state) => {
    const bemBlock = 'afb-range';
    const input = defaultInputRender(state);
    input.step = state.step;
    input.value = state.value;
    const div = document.createDocumentFragment();

    const hover = document.createElement('span');
    hover.className = `${bemBlock}__widget-value`;
    this.#updateView(state, hover, input);

    const min = document.createElement('span');
    min.className = `${bemBlock}__widget__min`;
    try {
      min.textContent = this.format(state.minimum, state);
    } catch (e) {
      console.error(e);
      min.textContent = state.minimum;
    }
    const max = document.createElement('span');
    max.className = `${bemBlock}__widget__max`;
    try {
      max.textContent = this.format(state.maximum, state);
    } catch (e) {
      console.error(e);
      max.textContent = state.maximum;
    }
    // div.append(input, hover, min, max);
    div.append(input);
    return div;
  };

  renderField(model) {
    return createFormElement(model, this.renderInput);
  }

  render(model) {
    const element = this.renderField(model);
    this.addListener();
    return element;
  }
}

export default async function decorate(block, model) {
  const range = new Range();
  block.append(range.render(model));
  return block;
}
