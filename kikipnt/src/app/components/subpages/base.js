import { MainApp } from '../../main';

export class Subpage {
    /**
     * @param {import('../../types').SubpageId} id
     * @param {import('../../types').SubpageLocation} location
     * @param {HTMLElement} rootContainer
     * @param {MainApp} mainApp
     */
    constructor(id, location, rootContainer, mainApp) {
        this.id = id;
        this.location = location;
        this.rootContainer = rootContainer;

        const onLangChange = () => {
            this.title = mainApp.loc.tr(`ui.sp.${id}.title`);
        };
        onLangChange();
        mainApp.events.target.addEventListener('langchange', onLangChange);
        if (id !== 'easteregg' && id !== 'home' && id !== 'map') {
            const bigTitle = document.createElement('span');
            bigTitle.classList.add('text-2xl', 'sm:text-3xl', 'font-bold', 'block');
            this.rootContainer.appendChild(bigTitle);
            mainApp.loc.bindSimpleEl(bigTitle, `ui.sp.${id}.title`);
        }
    }
}
