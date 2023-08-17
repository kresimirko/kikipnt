import { MainApp } from '../../main';
import { Subpage } from './base';
import { SubpageAbout } from './about/main';
import { SubpageHome } from './home/main';
import { SubpageMap } from './map/main';
import { SubpageSettings } from './settings/main';
import { SubpageEasterEgg } from './about/easterEgg';
import { SubpageHistory } from './map/history';

export class SubpageCollection {
    #mainApp;

    /** @param {MainApp} mainApp */
    constructor(mainApp) {
        this.#mainApp = mainApp;

        /** @type {Subpage[]} */
        this.mainSubpages = [
            new SubpageAbout(this.#mainApp),
            new SubpageEasterEgg(this.#mainApp),
            new SubpageHome(this.#mainApp),
            new SubpageMap(this.#mainApp),
            new SubpageSettings(this.#mainApp),
            new SubpageHistory(this.#mainApp),
        ];

        this.rootEl = document.createElement('div');
        this.rootEl.classList.add('flex', 'flex-col', 'min-h-0', 'min-w-0', 'h-full');

        this.mainContainer = document.createElement('div');
        this.mainContainer.classList.add('w-full', 'h-full', 'p-4', 'pt-[4.5rem]', 'min-w-0', 'overflow-auto');
        this.rootEl.appendChild(this.mainContainer);

        /** @type {Subpage} */
        this.currentSubpage;
        const updateDocTitle = () => {
            // ovaj timeout nije baš potreban, ali je bolje malo pričekati (title se prvo mora updateati pa je bolje biti siguran)
            setTimeout(() => {
                if (this.currentSubpage)
                    document.title = `${this.#mainApp.consts.appName} - ${this.currentSubpage.title}`;
            }, 10);
        };

        const pageNotFoundSpan = document.createElement('span');
        this.#mainApp.loc.bindSimpleEl(pageNotFoundSpan, 'ui.page_not_found');

        const onHashChange = () => {
            for (const el of this.mainContainer.children) {
                this.mainContainer.removeChild(el);
            }

            // uklanjamo nepotreban / na kraju
            let wantedLocation = location.hash;
            let wantedLocationSplit = wantedLocation.split('');
            if (wantedLocationSplit[wantedLocationSplit.length - 1] === '/') {
                wantedLocationSplit.pop();
                wantedLocation = wantedLocationSplit.join('');
            }

            // brzi fix
            if (wantedLocation === '') {
                wantedLocation = '#';
            }

            let subpageExists = false;
            for (const subpage of this.mainSubpages) {
                if (wantedLocation === subpage.location) {
                    this.currentSubpage = subpage;
                    updateDocTitle();
                    this.mainContainer.appendChild(subpage.rootContainer);
                    subpageExists = true;
                }
            }
            if (!subpageExists) {
                this.mainContainer.appendChild(pageNotFoundSpan);
            }

            this.#mainApp.events.quick.subpage.collectionRefreshed();
        };
        window.addEventListener('hashchange', onHashChange);
        onHashChange();

        const onLangChange = () => {
            updateDocTitle();
        };
        onLangChange();
        this.#mainApp.events.target.addEventListener('langchange', onLangChange);
    }
}
