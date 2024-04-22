import { Subpage } from '../base';
import { MainApp } from '../../../main';
import store from 'store2';
import { QuickButton, qbStyles } from '../../common/quickButton';

export class SubpageHistory extends Subpage {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        const rootContainer = document.createElement('div');
        super('history', '#/map/history', rootContainer, mainApp);
        this.#mainApp = mainApp;

        const noneYetLabel = document.createElement('span');
        noneYetLabel.classList.add('text-sm', 'block');
        this.#mainApp.loc.bindSimpleEl(noneYetLabel, 'ui.generic.nothing_here_yet');

        const textNotice = document.createElement('span');
        textNotice.classList.add('text-sm', 'opacity-60', 'block');
        this.#mainApp.loc.bindSimpleEl(textNotice, 'ui.sp.history.text_notice');

        this.rootContainer.classList.add('space-y-2', 'md:container', 'md:mx-auto', 'max-w-full');
        const historyContainer = document.createElement('div');
        historyContainer.classList.add('flex', 'flex-col');
        const eraseAllButton = new QuickButton(
            {
                icon: 'delete',
                locValue: 'ui.sp.history.erase_all',
                styles: [qbStyles.alt],
                clickEvent: () => {
                    if (confirm(this.#mainApp.loc.tr('ui.sp.history.erase_all.confirm'))) {
                        store.remove('user.history');
                        this.#mainApp.events.quick.clearHistory();
                    }
                },
            },
            this.#mainApp
        );

        this.rootContainer.appendChild(eraseAllButton.buttonEl);
        this.rootContainer.appendChild(document.createElement('hr'));
        this.rootContainer.appendChild(noneYetLabel);
        this.rootContainer.appendChild(textNotice);
        this.rootContainer.appendChild(historyContainer);

        /** @param {string} name */
        const createHistoryButton = (name) => {
            return new QuickButton(
                {
                    icon: 'history',
                    rightIcon: 'arrow_forward',
                    text: `${name}`,
                    styles: [qbStyles.alt],
                    clickEvent: () => {
                        this.#mainApp.events.quick.search.byText(name, true);
                    },
                },
                this.#mainApp
            );
        };

        /** @type {string[]} */
        const existingHistory = store.get('user.history');
        if (existingHistory) {
            noneYetLabel.classList.add('hidden');
            existingHistory.forEach((name) => {
                historyContainer.appendChild(createHistoryButton(name).buttonEl);
            });
        }

        this.#mainApp.events.target.addEventListener(
            'addedtohistory',
            /** @param {CustomEvent} event */ (event) => {
                noneYetLabel.classList.add('hidden');
                historyContainer.prepend(createHistoryButton(event.detail).buttonEl);
            }
        );

        this.#mainApp.events.target.addEventListener(
            'historycleared',
            /** @param {CustomEvent} event */ (event) => {
                noneYetLabel.classList.remove('hidden');
                historyContainer.innerHTML = '';
            }
        );

        this.#mainApp.events.target.addEventListener(
            'historyrefreshed',
            /** @param {CustomEvent} event */ (event) => {
                historyContainer.innerHTML = '';
                /** @type {string[]} */
                const newHistory = store.get('user.history');
                newHistory.forEach((name) => {
                    historyContainer.appendChild(createHistoryButton(name).buttonEl);
                });
            }
        );
    }
}
