import store from 'store2';
import { Subpage } from '../base';
import { qbStyles, QuickButton } from '../../common/quickButton';
import { MainApp } from '../../../main';

export class SubpageSettings extends Subpage {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        const rootContainer = document.createElement('div');
        super('settings', '#/settings', rootContainer, mainApp);
        this.#mainApp = mainApp;

        this.rootContainer.classList.add('space-y-2', 'md:container', 'md:mx-auto');

        const themeLabel = document.createElement('span');
        themeLabel.classList.add('text-xl', 'block');
        this.#mainApp.loc.bindSimpleEl(themeLabel, 'ui.sp.settings.theme');
        this.rootContainer.appendChild(themeLabel);

        this.rootContainer.appendChild(
            this.#mainApp.createOptionsRadio({
                key: 'theme',
                optionList: [
                    { locValue: 'ui.sp.settings.themes.light', value: 'light' },
                    { locValue: 'ui.sp.settings.themes.dark', value: 'dark' },
                    { locValue: 'ui.sp.settings.themes.auto', value: 'auto' },
                ],
            })
        );

        this.rootContainer.appendChild(
            this.#mainApp.createOptionsCheckbox([
                { locValue: 'ui.sp.settings.themes.dark_tiles', key: 'dark_tiles' },
                { locValue: 'ui.sp.settings.themes.blur_enabled', key: 'blur_enabled' },
            ])
        );

        const langLabel = document.createElement('span');
        langLabel.classList.add('text-xl', 'pt-4', 'block');
        this.#mainApp.loc.bindSimpleEl(langLabel, 'ui.sp.settings.language');
        this.rootContainer.appendChild(langLabel);

        this.rootContainer.appendChild(
            this.#mainApp.createOptionsRadio({
                key: 'language',
                optionList: [
                    { text: 'English (en)', value: 'en' },
                    { text: 'Hrvatski (Croatian) (hr)', value: 'hr' },
                ],
            })
        );

        this.rootContainer.appendChild(document.createElement('hr'));

        const clearAllSettingsButton = new QuickButton(
            {
                locValue: 'ui.sp.settings.erase_all_data',
                icon: 'delete',
                styles: [
                    qbStyles.classic,
                    {
                        root: ['block'],
                        content: ['bg-nord-11', 'text-nord-6'],
                    },
                ],
                clickEvent: () => {
                    if (confirm(this.#mainApp.loc.tr('ui.sp.settings.erase_all_data_confirm'))) {
                        store.clearAll();
                        location.reload();
                    }
                },
            },
            this.#mainApp
        );
        this.rootContainer.appendChild(clearAllSettingsButton.buttonEl);
    }
}
