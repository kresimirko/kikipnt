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
                    { locValue: 'ui.generic.auto_choice', value: 'auto' },
                    { locValue: 'ui.sp.settings.themes.light', value: 'light' },
                    { locValue: 'ui.sp.settings.themes.dark', value: 'dark' },
                ],
            })
        );

        this.rootContainer.appendChild(
            this.#mainApp.createOptionsCheckbox([
                { locValue: 'ui.sp.settings.themes.blur_enabled', key: 'blur_enabled' },
            ])
        );

        const mapLabel = document.createElement('span');
        mapLabel.classList.add('text-xl', 'pt-4', 'block');
        this.#mainApp.loc.bindSimpleEl(mapLabel, 'ui.sp.settings.map');
        this.rootContainer.appendChild(mapLabel);

        this.rootContainer.appendChild(
            this.#mainApp.createOptionsCheckbox([{ locValue: 'ui.sp.settings.map.dark_tiles', key: 'dark_tiles' }]),
        );

        const retinaTilesLabel = document.createElement('span');
        retinaTilesLabel.classList.add('text-lg', 'pt-2', 'block');
        this.#mainApp.loc.bindSimpleEl(retinaTilesLabel, 'ui.sp.settings.map.retina_tiles');
        this.rootContainer.appendChild(retinaTilesLabel);

        this.rootContainer.appendChild(
            this.#mainApp.createOptionsRadio({
                key: 'retina_tiles',
                optionList: [
                    { locValue: 'ui.generic.auto_choice', value: 'auto' },
                    { locValue: 'ui.sp.settings.map.retina_tiles.always', value: 'always' },
                    { locValue: 'ui.sp.settings.map.retina_tiles.never', value: 'never' },
                ],
            }),
        );

        const rtInfoAutoLabel = document.createElement('span');
        rtInfoAutoLabel.classList.add('text-sm', 'block');
        this.#mainApp.loc.bindSimpleEl(rtInfoAutoLabel, 'ui.sp.settings.map.retina_tiles.info.auto');
        this.rootContainer.appendChild(rtInfoAutoLabel);
        const rtInfoLoadLabel = document.createElement('span');
        rtInfoLoadLabel.classList.add('text-sm', 'block');
        this.#mainApp.loc.bindSimpleEl(rtInfoLoadLabel, 'ui.sp.settings.map.retina_tiles.info.load');
        this.rootContainer.appendChild(rtInfoLoadLabel);

        const langLabel = document.createElement('span');
        langLabel.classList.add('text-xl', 'pt-4', 'block');
        this.#mainApp.loc.bindSimpleEl(langLabel, 'ui.sp.settings.language');
        this.rootContainer.appendChild(langLabel);

        this.rootContainer.appendChild(
            this.#mainApp.createOptionsRadio({
                key: 'language',
                optionList: [
                    { locValue: 'ui.generic.auto_choice', value: 'auto' },
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
