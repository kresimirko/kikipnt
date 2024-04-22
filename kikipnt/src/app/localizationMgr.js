import hr from './assets/languages/hr.json';
import en from './assets/languages/en.json';
import { MainApp } from './main';

export class LocalizationManager {
    #mainApp;

    /** @type {import('./types').LanguageObject} */
    #languageObj;

    /** @type {import('./types').LangBoundElement[]} */
    #boundElements = []; // ništa ne sprečava duplicirane elemente!

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        this.#mainApp = mainApp;

        const onLangChange = () => {
            const language = this.#mainApp.storage.safeGet('language');

            switch (language) {
                case 'hr':
                    this.#languageObj = hr;
                    break;
                case 'en':
                    this.#languageObj = en;
                    break;
                case 'auto':
                    const lang = navigator.language.substring(0, 2);
                    if (lang === 'en') {
                        this.#languageObj = en;
                    } else if (lang === 'hr' || lang === 'bs' || lang === 'sr' ) { // hrvatski, bosanski, srpski
                        this.#languageObj = hr;
                    } else {
                        this.#languageObj = en;
                    }
                    break;
                default:
                    console.warn('Invalid language stored in user store! Setting to en...');
                    this.#mainApp.storage.safeSet('language', 'en');
                    this.#languageObj = en;
                    break;
            }

            for (const boundElObject of this.#boundElements) {
                if (boundElObject.useAriaLabel)
                    boundElObject.element.setAttribute('aria-label', this.tr(boundElObject.locValue));
                else if (boundElObject.useTitle) boundElObject.element.title = this.tr(boundElObject.locValue);
                else boundElObject.element.innerHTML = this.tr(boundElObject.locValue);
            }
        };
        onLangChange();
        this.#mainApp.events.target.addEventListener('langchange', onLangChange);

        this.#mainApp.events.target.addEventListener('settingschanged', () => {
            this.#mainApp.events.quick.settings.langChanged();
        });
    }

    /**
     * @param {import('./types').LanguageValues} langValue
     */
    tr(langValue) {
        if (this.#languageObj[langValue]) {
            return this.#languageObj[langValue];
        } else {
            console.warn(`loc: cannot find string '${langValue}'`);
            return langValue;
        }
    }

    /**
     * @param {HTMLElement} element
     * @param {import('./types').LanguageValues} locValue
     */
    bindSimpleEl(element, locValue) {
        this.#boundElements.push({
            element: element,
            locValue: locValue,
        });

        const trString = this.tr(locValue);

        if ('placeholder' in element) element.placeholder = trString;
        else element.innerHTML = trString;
    }

    /**
     * @param {HTMLElement} element
     * @param {import('./types').LanguageValues} locValue
     */
    bindSimpleElAriaLabel(element, locValue) {
        this.#boundElements.push({
            element: element,
            locValue: locValue,
            useAriaLabel: true,
        });

        const trString = this.tr(locValue);

        element.setAttribute('aria-label', trString);
    }

    /**
     * @param {HTMLElement} element
     * @param {import('./types').LanguageValues} locValue
     */
    bindSimpleElTitle(element, locValue) {
        this.#boundElements.push({
            element: element,
            locValue: locValue,
            useTitle: true,
        });

        const trString = this.tr(locValue);

        element.title = trString;
    }
}
