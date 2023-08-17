import { qbStyles, QuickButton } from '../common/quickButton';
import { SearchBox } from './searchBox';
import { MainApp } from '../../main';

export class TopBarHeader {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        this.#mainApp = mainApp;

        this.rootEl = document.createElement('div');
        this.rootEl.classList.add('flex', 'items-center', 'w-full');

        const miniLogo = document.createElement('a');
        miniLogo.draggable = false;
        miniLogo.href = '#';
        miniLogo.classList.add('sm:hidden', 'mr-2');
        this.#mainApp.loc.bindSimpleElAriaLabel(miniLogo, 'ui.sp.home.title');
        this.#mainApp.statusLabel.addLoc(miniLogo, 'ui.sp.home.title');
        this.rootEl.appendChild(miniLogo);

        const logo = document.createElement('a');
        logo.draggable = false;
        logo.href = '#';
        logo.classList.add('hidden', 'sm:block', 'mr-3');
        this.#mainApp.loc.bindSimpleElAriaLabel(logo, 'ui.sp.home.title');
        this.#mainApp.statusLabel.addLoc(logo, 'ui.sp.home.title');
        this.rootEl.appendChild(logo);

        const miniLogoImg = document.createElement('img');
        miniLogoImg.classList.add('max-h-8', 'pointer-events-none');
        miniLogoImg.alt = 'kikipnt logo';
        miniLogoImg.src = this.#mainApp.consts.miniLogoURL.toString();
        miniLogo.appendChild(miniLogoImg);

        const logoImg = document.createElement('img');
        logoImg.classList.add('max-h-8', 'pointer-events-none');
        logoImg.alt = 'kikipnt logo';
        logo.appendChild(logoImg);

        const searchForm = document.createElement('form');
        searchForm.classList.add('hidden', 'md:block', 'w-72', 'lg:w-96');
        this.rootEl.appendChild(searchForm);

        const searchBox = new SearchBox(this.#mainApp);
        searchForm.appendChild(searchBox.rootEl);

        searchForm.onsubmit = () => {
            setTimeout(() => {
                this.#mainApp.events.quick.search.byText(searchBox.inputBoxInput.value);
                searchBox.optionsDropdown.hide(); // potrebno zbog nekog razloga
                searchBox.inputBoxInput.blur();
            }, 50);
            return false;
        };

        // ako je ekran malen
        const searchButton = new QuickButton(
            {
                locValue: 'ui.generic.search',
                icon: 'search',
                styles: [
                    qbStyles.alt,
                    {
                        root: ['md:hidden'],
                        text: ['hidden', 'xs:block'],
                    },
                ],
                link: '#/map',
            },
            this.#mainApp
        );
        this.rootEl.appendChild(searchButton.buttonEl);

        const sideButtonsContainer = document.createElement('div');
        sideButtonsContainer.classList.add('flex', 'space-x-1', 'ml-2', '!ml-auto', 'items-center');
        this.rootEl.appendChild(sideButtonsContainer);

        sideButtonsContainer.appendChild(this.#mainApp.statusLabel.rootEl);

        const historyButton = new QuickButton(
            {
                locValue: 'ui.sp.history.title',
                icon: 'history',
                styles: [qbStyles.alt, { text: ['hidden'] }],
                link: '#/map/history',
                bindToStatusLabel: true,
            },
            this.#mainApp
        );
        sideButtonsContainer.appendChild(historyButton.buttonEl);

        const settingsButton = new QuickButton(
            {
                locValue: 'ui.sp.settings.title',
                icon: 'settings',
                styles: [qbStyles.alt, { text: ['hidden'] }],
                link: '#/settings',
                bindToStatusLabel: true,
            },
            this.#mainApp
        );
        sideButtonsContainer.appendChild(settingsButton.buttonEl);

        const aboutButton = new QuickButton(
            {
                locValue: 'ui.sp.about.title',
                icon: 'info',
                styles: [qbStyles.alt, { text: ['hidden'] }],
                link: '#/about',
                bindToStatusLabel: true,
            },
            this.#mainApp
        );
        sideButtonsContainer.appendChild(aboutButton.buttonEl);

        /** @param {boolean} isDark */
        const updateLogo = (isDark) => {
            isDark
                ? (logoImg.src = this.#mainApp.consts.darkLogoURL.toString())
                : (logoImg.src = this.#mainApp.consts.lightLogoURL.toString());
        };
        this.#mainApp.events.target.addEventListener(
            'themechanged',
            /** @param {CustomEvent} event */
            (event) => {
                updateLogo(event.detail.isDark);
            }
        );
        updateLogo(this.#mainApp.themeManager.isCurrentThemeDark());
    }

    hide() {
        this.rootEl.classList.add('hidden');
    }

    show() {
        this.rootEl.classList.remove('hidden');
    }

    toggle() {
        this.rootEl.classList.toggle('hidden');
    }

    isVisible() {
        return !this.rootEl.classList.contains('hidden');
    }
}
