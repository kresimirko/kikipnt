import { MainApp } from '../../main';

export class StatusLabel {
    #mainApp;

    /** @param {MainApp} mainApp */
    constructor(mainApp) {
        this.#mainApp = mainApp;

        this.rootEl = document.createElement('span');
        this.rootEl.classList.add('hidden', 'sm:block', 'text-sm');
    }

    /**
     * @param {HTMLElement} element
     * @param {import('../../types').LanguageValues} locValue
     * @param {boolean} [clearOnClick]
     */
    addLoc(element, locValue, clearOnClick) {
        element.addEventListener('mouseover', () => {
            this.rootEl.innerText = this.#mainApp.loc.tr(locValue);
        });
        element.addEventListener('focus', () => {
            this.rootEl.innerText = this.#mainApp.loc.tr(locValue);
        });
        element.addEventListener('mouseout', () => {
            this.rootEl.innerText = '';
        });
        element.addEventListener('blur', () => {
            this.rootEl.innerText = '';
        });
        this.#mainApp.loc.bindSimpleElTitle(element, locValue);

        if (clearOnClick) element.addEventListener('click', () => this.clear());
    }

    /**
     * @param {HTMLElement} element
     * @param {string} text
     * @param {boolean} [clearOnClick]
     */
    addBasic(element, text, clearOnClick) {
        element.addEventListener('mouseover', () => {
            this.rootEl.innerText = text;
        });
        element.addEventListener('focus', () => {
            this.rootEl.innerText = text;
        });
        element.addEventListener('mouseout', () => {
            this.rootEl.innerText = '';
        });
        element.addEventListener('blur', () => {
            this.rootEl.innerText = '';
        });
        element.title = text;

        if (clearOnClick) element.addEventListener('click', () => this.clear());
    }

    clear() {
        this.rootEl.innerText = '';
    }
}
