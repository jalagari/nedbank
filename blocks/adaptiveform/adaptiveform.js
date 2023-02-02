import ExcelToFormModel from './libs/afb-transform.js';
import { renderChildren } from './libs/afb-builder.js';
import { readBlockConfig } from '../../scripts/scripts.js';

export class AdaptiveForm {
  form;

  element;

  formJson;

  metadata;

  /**
   * @param {HTMLLinkElement} element
   * @param {any} formJson
   */
  constructor(element, formJson, metadata) {
    this.element = element;
    this.formJson = formJson;
    this.metadata = metadata;
  }

  render = async () => {
    const form = document.createElement('form');
    form.className = 'afb-form';
    this.form = form;

    await renderChildren(this.formJson?.items, this.form);
    return form;
  };
}

/**
  * @param {HTMLLinkElement} formLink
  * */
const createFormContainer = async (block, url, metadata) => {
  const transform = new ExcelToFormModel();
  const convertedData = await transform.getFormModel(url);

  const adaptiveform = new AdaptiveForm(block, convertedData?.formDef, metadata);
  const form = await adaptiveform.render();
  block?.replaceWith(form);

  window.adaptiveform = adaptiveform; // TODO - remove after testing

  return adaptiveform;
};

/**
   * @param {{ querySelector: (arg0: string) => HTMLLinkElement | null; }} block
   */
export default async function decorate(block) {
  const conf = readBlockConfig(block);
  const formLink = block?.querySelector('a[href$=".json"]');
  const formLinkWrapper = formLink?.parentElement;

  if (!formLink || !formLink.href) {
    throw new Error("No formdata action is provided, can't render adaptiveformblock");
  }

  // eslint-disable-next-line no-return-await
  return await createFormContainer(formLinkWrapper || formLink, formLink.href, conf);
}
