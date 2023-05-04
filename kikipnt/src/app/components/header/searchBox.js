import hotkeys from 'hotkeys-js';
import { DropdownNew } from '../common/dropdownNew';
import { MainApp } from '../../main';
import { QuickInput } from '../common/quickInput';

export class SearchBox extends QuickInput {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        super({ icon: 'search' }, mainApp);
        this.#mainApp = mainApp;

        this.optionsDropdown = new DropdownNew(this.#mainApp, this.inputBoxContainer, {
            initialItems: [
                {
                    locValue: 'ui.generic.search',
                    icon: 'search',
                    rightIcon: 'arrow_right_alt',
                    clickEvent: () => {
                        if (this.inputBoxInput.value)
                            this.#mainApp.events.quick.search.byText(this.inputBoxInput.value);
                    },
                },
                {
                    locValue: 'ui.generic.open_map',
                    icon: 'map',
                    rightIcon: 'arrow_right_alt',
                    link: '#/map',
                },
            ],
            title: { locValue: 'ui.searchbox.dropdown.msg' },
            extraClasses: ['w-72', 'lg:w-96', 'invisible', 'md:visible'],
            triggerType: 'none',
            fitSize: true,
        });

        this.inputBoxInput.classList.add('max-h-8');
        this.inputIconContainer.classList.add(
            'mx-2',
            'absolute',
            'z-10',
            'left-0',
            'inset-y-0',
            'flex',
            'items-center',
            'pointer-events-none'
        );
        this.inputIcon.classList.add('material-symbols-rounded');

        this.inputBoxInput.addEventListener('focus', () => {
            this.optionsDropdown.show();
        });

        hotkeys('ctrl+k', (event) => {
            event.preventDefault();
            this.inputBoxInput.focus();
        });

        this.#mainApp.events.target.addEventListener('easteregg', () => {
            if (this.inputBoxInput.value === 'niko') {
                setTimeout(() => {
                    location.hash = '#/about/easteregg';
                }, 10);
            }
        });

        const onLangChange = () => {
            this.inputBoxInput.placeholder = this.#mainApp.loc.tr('ui.searchbox.label') + ' [Ctrl+K]';
        };
        onLangChange();
        this.#mainApp.events.target.addEventListener('langchange', onLangChange);
    }
}
