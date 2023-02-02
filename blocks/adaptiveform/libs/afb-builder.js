import { Constants } from './constants.js';

/**
 * @param {string} tooltip text for the tooltip
 */
export function createTooltipHTML(tooltip) {
  const tooltipEl = document.createElement('div');
  tooltipEl.className = `afb__${Constants.TOOLTIP}`;
  tooltipEl.textContent = tooltip;
  return tooltipEl;
}

export function renderTooltip(target, tooltip) {
  tooltip.style.visibility = 'hidden';
  document.body.append(tooltip);

  const targetPos = target.getBoundingClientRect();
  const tooltipPos = tooltip.getBoundingClientRect();

  let left = targetPos.left + (targetPos.width / 2) + window.scrollX - (tooltipPos.width / 2);
  let top = targetPos.top + window.scrollY - (tooltipPos.height + 10);
  let placement = 'top';

  if (left < 0) {
    placement = 'right';
    left = targetPos.left + targetPos.width + window.scrollX + 10;
    top = targetPos.top + (targetPos.height / 2) + window.scrollY - (tooltipPos.height / 2);
  }

  if (left + tooltipPos.width > document.documentElement.clientWidth) {
    placement = 'left';
    left = targetPos.left + window.scrollX - (tooltipPos.width + 10);
    top = targetPos.top + (targetPos.height / 2) + window.scrollY - (tooltipPos.height / 2);
  }

  if (top < 0) {
    placement = 'bottom';
    left = targetPos.left + (targetPos.width / 2) + window.scrollX - (tooltipPos.width / 2);
    top = targetPos.top + targetPos.height + window.scrollY + 10;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.className += ` ${Constants.ADAPTIVE_FORM_TOOLTIP}-${placement}`;
  tooltip.style.visibility = 'visible';
}

/**
 * @param {any} model FieldJson
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} element
 */
export const setDisabledAttribute = (model, element) => {
  element.disabled = model?.enabled === false;
};

/**
 * @param {any} model FieldJson
 * @param {HTMLInputElement | HTMLTextAreaElement} element
 */
export const setReadonlyAttribute = (model, element) => {
  element.readOnly = model?.readOnly === true;
};

/**
 * @param {any} model FieldJson
 * @param {HTMLInputElement | HTMLTextAreaElement} element
 */
export const setStringContraints = (model, element) => {
  const maxLength = model?.maxLength || 0;
  const minLength = model?.minLength || 0;
  if (minLength > 0) element.minLength = minLength;
  if (maxLength > 0) element.maxLength = maxLength;
  if (element instanceof HTMLInputElement && model?.pattern) element.pattern = model?.pattern;
};

/**
 * @param {any} model FieldJson
 * @param {HTMLInputElement} element
 */
export const setNumberConstraints = (model, element) => {
  const max = model?.maximum || 0;
  const min = model?.minimum || 0;
  if (max > 0) element.max = max?.toString();
  if (min > 0) element.min = min?.toString();
};

/**
 * @param {any} model FieldJson
 * @param {string} bemBlock
 *
 * @return {HTMLInputElement}
 */
export const defaultInputRender = (model, tag = 'input') => {
  const input = document.createElement(tag);
  input.id = model?.id;
  input.className = `afb-${model.fieldType}__widget`;
  input.title = model?.tooltip || '';
  input.name = model?.name || '';
  input.value = model?.value;
  input.placeholder = model?.placeholder || '';
  input.required = model?.required === true;
  input.setAttribute('aria-label', model?.label?.value || '');
  setDisabledAttribute(model, input);
  setReadonlyAttribute(model, input);
  setStringContraints(model, input);
  setNumberConstraints(model, input);

  if (input instanceof HTMLInputElement) {
    input.type = model?.fieldType || 'text';
  }
  return input;
};

export const appendChild = (parent, element) => {
  if (parent && element) {
    parent.appendChild(element);
  }
};

/**
 * @param {any} label label of the field
 * @param {string} inputId id of the element the label is bound to
 */
// eslint-disable-next-line consistent-return
export const createLabel = (label, fieldType, inputId, tag = 'label') => {
  if (label && label.value) {
    const labelEl = document.createElement(tag);
    labelEl.htmlFor = inputId;
    labelEl.className = `afb-${fieldType}__label`;
    labelEl.textContent = label.value;
    return labelEl;
  }
};

/**
 * @param {any} model FieldJson
 */
// eslint-disable-next-line consistent-return
export const createQuestionMarkHTML = (model) => {
  if (model?.tooltip) {
    const button = document.createElement('button');
    button.dataset.text = model.tooltip;
    button.setAttribute('aria-label', 'Help Text');
    button.className = `afb__${Constants.QM}`;

    const tooltip = createTooltipHTML(model.tooltip);

    button.addEventListener('mouseenter', (event) => {
      renderTooltip(event.target, tooltip);
      event.stopPropagation();
    });

    button.addEventListener('mouseleave', (event) => {
      tooltip.remove();
      event.stopPropagation();
    });

    return button;
  }
};

/**
 * @param {any} description help text for the field
 */
export const createLongDescHTML = (description) => {
  let div;
  if (description) {
    div = document.createElement('div');
    div.setAttribute('aria-live', 'polite');
    div.className = `afb__${Constants.LONG_DESC}`;
    div.innerHTML = description;
    return div;
  }
  return div;
};

/**
 *
 * @param {any} model FieldJson
 * @param {string} bemBlock
 * @param {Function} renderInput
 *
 * @return {HTMLDivElement}
 */
export const createFormElement = (model, renderInp) => {
  const renderInput = renderInp || defaultInputRender;

  const element = document.createDocumentFragment();
  appendChild(element, createLabel(model.label, model.fieldType, model.id));
  appendChild(element, createQuestionMarkHTML(model));
  appendChild(element, renderInput(model));
  appendChild(element, createLongDescHTML(model?.description));

  return element;
};

/**
 * @param {any} model FieldJson
 * @param {string} bemBlock
 */
export const createFieldWrapper = (model, bemBlock) => {
  const element = document.createElement('div');
  model.className = `${bemBlock} ${model.style || ''}`;
  element.className = bemBlock;
  return element;
};

/**
 *
 * @param {HTMLDivElement} element
 * @returns
 */
export const getWidget = (element) => element?.querySelector(`[class$='${Constants.WIDGET}']`);

/**
 * @param {string} componentName
 * @return {Promise<any>} component
 */
export const loadComponent = async (componentName) => {
  let component;
  try {
    component = await import(`../components/${componentName}/${componentName}.js`);
  } catch (error) {
    console.log(`Unable to find module ${componentName}`, error);
  }
  return component;
};

/**
 * @param field
 * */
export const getRender = async (fieldModel) => {
  if (fieldModel.fieldType === 'hidden') {
    return defaultInputRender(fieldModel);
  }
  let block = createFieldWrapper(fieldModel, `afb-${fieldModel.fieldType}`);
  block.classList.add(fieldModel.name);
  try {
    let component; const
      fieldType = fieldModel?.fieldType || '';
    const widgetType = Constants.fieldTypeMappings[fieldType] || fieldType;
    if (!Constants.DEFAULT_INPUT_TYPES.includes(widgetType) && widgetType) {
      component = await loadComponent(widgetType);
    }
    let element;
    if (component && component.default) {
      block = await component?.default(block, fieldModel);
    } else {
      element = createFormElement(fieldModel);
      const widget = getWidget(element);
      widget?.addEventListener('blur', () => {
        // this.model.value = e.target.value;
      });
      appendChild(block, element);
    }
  } catch (error) {
    console.log('Unexpected error ', error);
  }
  return block;
};

export const renderChildren = async (fields, parent) => {
  if (fields && fields.length > 0) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const index in fields) {
      const field = fields[index];
      // eslint-disable-next-line no-await-in-loop
      const element = await getRender(field);
      parent.append(element);
    }
  }
};
