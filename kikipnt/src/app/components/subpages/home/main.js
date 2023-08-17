import { Subpage } from '../base';
import { MainApp } from '../../../main';
import { QuickButton, qbStyles } from '../../common/quickButton';
import { QuickInput } from '../../common/quickInput';

export class SubpageHome extends Subpage {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        const rootContainer = document.createElement('div');
        super('home', '#', rootContainer, mainApp);
        this.#mainApp = mainApp;

        this.rootContainer.classList.add('flex', 'flex-col', 'items-center', 'space-y-4');

        const inlineContainer = document.createElement('div');
        inlineContainer.classList.add('space-y-2', 'grid', 'justify-items-center', 'mt-4', 'lg:mt-8');
        this.rootContainer.appendChild(inlineContainer);

        const logo = document.createElement('img');
        logo.alt = 'kikipnt logo';
        logo.classList.add('pointer-events-none', 'w-48', 'sm:w-64', 'lg:w-72');
        inlineContainer.appendChild(logo);

        const welcomeLabel = document.createElement('span');
        welcomeLabel.classList.add('text-xl', 'block');
        this.#mainApp.loc.bindSimpleEl(welcomeLabel, 'ui.sp.home.greeting');
        this.rootContainer.appendChild(welcomeLabel);

        const searchForm = document.createElement('form');
        searchForm.classList.add('xs:w-72', 'sm:w-96');
        this.rootContainer.appendChild(searchForm);

        const searchInput = new QuickInput({ icon: 'search', phLocValue: 'ui.searchbox.label' }, this.#mainApp);
        searchForm.appendChild(searchInput.rootEl);

        searchForm.onsubmit = () => {
            setTimeout(() => {
                this.#mainApp.events.quick.search.byText(searchInput.inputBoxInput.value);
            }, 50);
            return false;
        };

        this.#mainApp.events.target.addEventListener('easteregg', () => {
            if (searchInput.inputBoxInput.value === 'niko') {
                setTimeout(() => {
                    location.hash = '#/about/easteregg';
                }, 10);
            }
        });

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('flex', 'space-x-1');
        this.rootContainer.appendChild(buttonsContainer);

        const searchButton = new QuickButton(
            {
                // ako je ekran malen
                locValue: 'ui.generic.search',
                icon: 'search',
                styles: [qbStyles.alt],
                clickEvent: () => {
                    this.#mainApp.events.quick.search.byText(searchInput.inputBoxInput.value);
                },
            },
            this.#mainApp
        );
        buttonsContainer.appendChild(searchButton.buttonEl);

        const mapButton = new QuickButton(
            {
                // ako je ekran malen
                locValue: 'ui.generic.open_map',
                icon: 'map',
                styles: [qbStyles.alt],
                link: '#/map',
            },
            this.#mainApp
        );
        buttonsContainer.appendChild(mapButton.buttonEl);

        const learnMoreLabel = document.createElement('span');
        learnMoreLabel.classList.add('flex', 'pt-4', 'text-sm', 'xs:text-base', 'text-center');
        this.#mainApp.loc.bindSimpleEl(learnMoreLabel, 'ui.sp.home.learn_more');
        this.rootContainer.appendChild(learnMoreLabel);

        const newKikipntAlertLabel = document.createElement('span');
        newKikipntAlertLabel.classList.add('block', 'pt-4', 'text-sm', 'xs:text-base', 'text-center');
        this.#mainApp.loc.bindSimpleEl(newKikipntAlertLabel, 'ui.sp.home.new_kikipnt_alert');
        this.rootContainer.appendChild(newKikipntAlertLabel);

        /** @param {boolean} isDark */
        const updateLogo = (isDark) => {
            isDark
                ? (logo.src = this.#mainApp.consts.darkLogoURL.toString())
                : (logo.src = this.#mainApp.consts.lightLogoURL.toString());
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
}
