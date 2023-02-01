/* eslint-disable import/no-cycle */
import { Constants } from './constants.js';
import {
  getLabelValue, getTooltipValue, getViewId, isLabelVisible, isTooltipVisible,
} from './afb-model.js';
import defaultInput from '../components/defaultInput.js';

/**
 * @param {any} model FieldJson
 * @param {string} bemBlock
 *
 * @return {HTMLInputElement}
 */
export const defaultInputRender = (model, bemBlock, tag = 'input') => {
  const input = document.createElement(tag);
  input.id = model?.id;
  input.className = `afb__widget`;
  input.title = isTooltipVisible(model) ? getTooltipValue(model) : '';
  input.name = model?.name || '';
  input.value = model?.value;
  input.placeholder = model?.placeholder || '';
  input.required = model?.required === true;
  input.setAttribute('aria-label', isLabelVisible(model) ? getLabelValue(model) : '');
  setDisabledAttribute(model, input);
  setReadonlyAttribute(model, input);
  setStringContraints(model, input);
  setNumberConstraints(model, input);

  if (input instanceof HTMLInputElement) {
    input.type = model?.fieldType || 'text';
  }
  return input;
};

/**
 *
 * @param {any} model FieldJson
 * @param {string} bemBlock
 * @param {Function} renderInput
 *
 * @return {HTMLDivElement}
 */
export const createWidget = (model, bemBlock, renderInp) => {
  const renderInput = renderInp || defaultInputRender;

  const element = document.createDocumentFragment();
  const label = createLabel(model, bemBlock);
  const inputs = renderInput(model, bemBlock);
  const longDesc = createLongDescHTML(model, bemBlock);
  const help = createQuestionMarkHTML(model, bemBlock);

  if (label) { element.appendChild(label); }
  if (help) { element.appendChild(help); }
  if (inputs) { element.appendChild(inputs); }
  if (longDesc) { element.appendChild(longDesc); }

  return element;
};

export function addStyle(element, model) {
  // add support for comma separated styles.
  element.className += model?.style ? ` ${model?.style}` : '';
}

/**
 * @param {any} model FieldJson
 * @param {string} bemBlock
 */
export const createWidgetWrapper = (model, bemBlock) => {
  const element = document.createElement('div');
  element.className = bemBlock;
  element.dataset.cmpVisible = `${!(model?.visible === false)}`;
  element.dataset.cmpEnabled = `${!(model?.enabled === false)}`;

  addStyle(element, model);

  return element;
};

/**
 * @param {any} model FieldJson
 * @param {string} bemBlock
 */
// eslint-disable-next-line consistent-return
export const createLabel = (model, bemBlock) => {
  if (isLabelVisible(model)) {
    const label = document.createElement('label');
    label.htmlFor = model?.id;
    label.className = `afb__label`;
    label.textContent = getLabelValue(model);
    return label;
  }
};

/**
 * @param {any} model FieldJson
 * @param {string} bemBlock
 */
export function createTooltipHTML(model, bemBlock) {
  const tooltip = document.createElement('div');
  tooltip.className = `afb__${Constants.TOOLTIP}`;
  tooltip.textContent = model?.tooltip;
  return tooltip;
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
 * @param {string} bemBlock
 */
// eslint-disable-next-line consistent-return
export const createQuestionMarkHTML = (model, bemBlock) => {
  if (model?.tooltip) {
    const button = document.createElement('button');
    button.dataset.text = model?.tooltip;
    button.setAttribute('aria-label', 'Help Text');
    button.className = `afb__${Constants.QM}`;

    const tooltip = createTooltipHTML(model, bemBlock);

    button.addEventListener('mouseenter', (event) => {
      renderTooltip(event.target, tooltip, bemBlock);
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
 * @param {any} model FieldJson
 * @param {string} bemBlock
 */
// eslint-disable-next-line consistent-return
export const createLongDescHTML = (model, /** @type {string} */ bemBlock) => {
  if (model?.description) {
    const div = document.createElement('div');
    div.setAttribute('aria-live', 'polite');
    div.className = `afb__${Constants.LONG_DESC}`;
   // div.className = `${bemBlock}__${Constants.ERROR_MESSAGE}`;

    div.innerHTML = model?.description || '';
    return div;
  }
};

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
  try {
    return await import(`../components/${componentName}/${componentName}.js`);
  } catch (error) {
    console.error(`Unable to find module ${componentName}`, error);
  }
  return undefined;
};

/**
 * @param field
 * */
export const getRender = async (fieldModel) => {
  let block = createWidgetWrapper(fieldModel, `afb-${fieldModel.fieldType}`);
  block.classList.add(fieldModel.name);
  block.classList.add("afb-widget")
  try {
    let component; const
      fieldType = fieldModel?.fieldType || '';
    const widgetType = Constants.fieldTypeMappings[fieldType] || fieldType;
    if (!Constants.DEFAULT_INPUT_TYPES.includes(widgetType) && widgetType) {
      component = await loadComponent(widgetType);
    }
    if (component && component.default) {
      await component?.default(block, fieldModel);
    } else {
      defaultInput(block, fieldModel);
    }
  } catch (error) {
    console.error('Unexpected error ', error);
  }
  return block
};

export const renderChildren = async (fields, parent ) => {
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
