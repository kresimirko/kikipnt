import { Subpage } from '../base';
import { MainApp } from '../../../main';
import { QuickButton, qbStyles } from '../../common/quickButton';

export class SubpageAbout extends Subpage {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        const rootContainer = document.createElement('div');
        super('about', '#/about', rootContainer, mainApp);
        this.#mainApp = mainApp;

        this.rootContainer.classList.add('flex', 'flex-col', 'items-center', 'space-y-4');

        const logoButton = document.createElement('button');
        logoButton.classList.add('cursor-default');
        this.#mainApp.loc.bindSimpleElTitle(logoButton, 'ui.sp.about.hint'); // kad bi se koristio status label to bi bilo preočito
        logoButton.addEventListener('click', () => {
            this.#mainApp.events.quick.easterEgg();
        });
        this.rootContainer.appendChild(logoButton);

        const logoImg = document.createElement('img');
        logoImg.classList.add(
            'pointer-events-none',
            'shadow-md',
            'rounded-lg',
            'bg-nord-4',
            'dark:bg-nord-3',
            'p-4',
            'w-64'
        );
        logoImg.alt = 'kikipnt logo';
        logoButton.appendChild(logoImg);

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

        const versionContainer = document.createElement('div');
        versionContainer.classList.add('space-x-1', 'flex');
        this.rootContainer.appendChild(versionContainer);

        const versionLabelSpan = document.createElement('span');
        versionLabelSpan.classList.add('text-sm', 'opacity-60', 'text-center');
        this.#mainApp.loc.bindSimpleEl(versionLabelSpan, 'ui.sp.about.version');
        versionContainer.appendChild(versionLabelSpan);

        const versionLabel = document.createElement('span');
        versionLabel.classList.add('text-sm', 'opacity-60', 'text-center');
        versionLabel.innerText = this.#mainApp.consts.appVersion;
        versionContainer.appendChild(versionLabel);

        const descriptionSpan = document.createElement('span');
        descriptionSpan.classList.add('text-center');
        this.#mainApp.loc.bindSimpleEl(descriptionSpan, 'ui.sp.about.description');
        this.rootContainer.appendChild(descriptionSpan);

        const learnMoreButton = new QuickButton(
            {
                locValue: 'ui.sp.about.learn_more',
                rightIcon: 'open_in_new',
                styles: [qbStyles.alt, { text: ['mr-1'] }],
                link: 'https://github.com/kresimirko/kikipnt',
            },
            this.#mainApp
        );
        this.rootContainer.appendChild(learnMoreButton.buttonEl);

        const tipSpan = document.createElement('span');
        tipSpan.classList.add('text-sm', 'opacity-60', 'text-center');
        this.#mainApp.loc.bindSimpleEl(tipSpan, 'ui.sp.about.tip');
        this.rootContainer.appendChild(tipSpan);
    }
}
