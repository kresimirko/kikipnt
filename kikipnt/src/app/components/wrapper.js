import { TopBarHeader } from './header/header';
import { qbStyles, QuickButton } from './common/quickButton';
import { SubpageCollection } from './subpages/subpageCollection';
import { MainApp } from '../main';

export class MainAppWrapper {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        this.#mainApp = mainApp;

        this.rootEl = document.createElement('div');
        this.rootEl.classList.add('flex', 'grow', 'min-w-0');

        const wavesContainer = document.createElement('div');
        wavesContainer.classList.add(
            'absolute',
            'flex',
            'pointer-events-none',
            'w-full',
            'h-full',
            'justify-end',
            'items-end',
            '-z-10'
        );
        this.rootEl.appendChild(wavesContainer);

        const waves = document.createElement('img');
        waves.classList.add('w-[40rem]');
        wavesContainer.appendChild(waves);

        const mainCointainer = document.createElement('div');
        mainCointainer.classList.add('flex', 'flex-col', 'grow', 'min-w-0');
        this.rootEl.appendChild(mainCointainer);

        const headerNavWrapper = document.createElement('div');
        headerNavWrapper.classList.add(
            'bg-nord-4/70',
            'dark:bg-[#262B35]/70',
            'z-10',
            'backdrop-blur-variable',
            'p-3',
            'min-w-full',
            'absolute',
            'top-0'
        );
        mainCointainer.appendChild(headerNavWrapper);

        const sCollection = new SubpageCollection(this.#mainApp);
        mainCointainer.appendChild(sCollection.mainContainer);

        const header = new TopBarHeader(this.#mainApp);
        headerNavWrapper.appendChild(header.rootEl);

        const toggleNavVisBtn = new QuickButton(
            {
                icon: 'placeholder', // TODO: ovo je hacky. popravi
                styles: [
                    qbStyles.alt,
                    {
                        root: ['sm:hidden'],
                        text: ['hidden'],
                    },
                ],
                clickEvent: () => {
                    header.toggle();
                    updateByNavVis();
                },
            },
            this.#mainApp
        );

        const updateByNavVis = () => {
            if (header.isVisible()) {
                toggleNavVisBtn.elements.icon.innerText = 'expand_less';
            } else {
                toggleNavVisBtn.elements.icon.innerText = 'expand_more';
            }
        };
        updateByNavVis();

        const lightWavesURL = new URL('../assets/img/kiki_waves.svg', import.meta.url);
        const darkWavesURL = new URL('../assets/img/kiki_waves_dark.svg', import.meta.url);

        // https://stackoverflow.com/questions/3646036/preloading-images-with-javascript
        new Image().src = darkWavesURL.toString();
        new Image().src = lightWavesURL.toString();

        /**
         * @param {boolean} isDark
         */
        const updateWaves = (isDark) => {
            isDark ? (waves.src = darkWavesURL.toString()) : (waves.src = lightWavesURL.toString());
        };

        this.#mainApp.events.target.addEventListener(
            'themechanged',
            /** @param {CustomEvent} event*/
            (event) => {
                updateWaves(event.detail.isDark);
            }
        );
        updateWaves(this.#mainApp.themeManager.isCurrentThemeDark());
    }
}
