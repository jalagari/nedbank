import { isArrayType } from '../../libs/afb-model.js';
import { Constants } from '../../libs/constants.js';
import { createFormElement, defaultInputRender } from '../../libs/afb-builder.js';

export class Select {
  blockName = Constants.SELECT;

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

  updateValue = (element, value) => {
    const isMultiSelect = isArrayType(this.model);
    if (this.element) {
      const select = this.getWidget();
      for (let index = 0; index < select?.options?.length; index += 1) {
        const option = select?.options?.[index];
        option.selected = (isMultiSelect && value?.includes(option.value))
          || (value === option.value);
      }
    }
  };

  addListener = () => {
    this.getWidget()?.addEventListener('blur', (e) => {
      if (isArrayType(this.model)) {
        const valueArray = [];
        const select = this.getWidget();
        for (let index = 0; index < select?.options?.length; index += 1) {
          const option = select?.options?.[index];
          if (option.selected) {
            valueArray.push(option.value);
          }
        }
        this.model.value = valueArray;
      } else {
        this.model.value = e.target.value;
      }
    });
  };

  createInputHTML = (state) => {
    const select = defaultInputRender(state, this.blockName, 'select');
    select.multiple = isArrayType(state);
    if (state.placeholder) {
      const option = this.createOption('', state.placeholder, true, true);
      select.appendChild(option);
    }
    this.createOptions(state, select);
    return select;
  };

  createOptions = (state, select) => {
    state?.enum?.forEach((enumVal, index) => {
      const opt = this.createOption(
        enumVal,
        this.model?.enumNames?.[index],
        (enumVal === state.default),
        false,
      );
      select.appendChild(opt);
    });
  };

  createOption = (enumValue, enumDisplayName, selected, disabled = false) => {
    const option = document.createElement('option');
    option.value = enumValue;
    option.disabled = disabled;
    option.textContent = enumDisplayName || enumValue;
    option.selected = selected;
    option.className = `${this.blockName}__option`;
    return option;
  };

  render() {
    this.element = createFormElement(this.model, this.createInputHTML);
    this.block.appendChild(this.element);
    this.addListener();
    // subscribe(this.model, this.element, { value: this.updateValue });
  }
}

export default async function decorate(block, model) {
  const select = new Select(block, model);
  select.render();
}
