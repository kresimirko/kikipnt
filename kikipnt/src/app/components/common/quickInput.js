import { MainApp } from '../../main';

export class QuickInput {
    #mainApp;

    /**
     * @param {import('../../types').QuickInputOptions} options
     * @param {MainApp} mainApp
     */
    constructor(options, mainApp) {
        this.#mainApp = mainApp;

        this.rootEl = document.createElement('div');

        this.inputBoxContainer = document.createElement('div');
        this.rootEl.appendChild(this.inputBoxContainer);

        this.inputBoxInput = document.createElement('input');
        this.inputBoxInput.type = 'text';
        this.inputBoxContainer.appendChild(this.inputBoxInput);

        this.inputIconContainer = document.createElement('div');
        this.inputBoxContainer.appendChild(this.inputIconContainer);

        this.inputIcon = document.createElement('span');
        this.inputIcon.innerText = options.icon;
        this.inputIconContainer.appendChild(this.inputIcon);

        this.inputBoxContainer.classList.add('bg-nord-6', 'dark:bg-nord-1', 'shadow', 'relative', 'flex', 'rounded');
        this.inputBoxInput.classList.add(
            'bg-transparent',
            'border-none',
            'rounded',
            'ring-simple',
            'focus:outline-none',
            'focus:ring',
            'focus:ring-nord-10',
            'focus:dark:ring-nord-9',
            'placeholder:text-[#8e9bb6]',
            'pl-10',
            'text-sm',
            'grow',
            'min-w-0'
        );
        this.inputIconContainer.classList.add(
            'mx-2',
            'absolute',
            'z-1',
            'left-0',
            'inset-y-0',
            'flex',
            'items-center',
            'pointer-events-none'
        );
        this.inputIcon.classList.add('material-symbols-rounded');

        // hotkeys library ne radi za ovo
        this.inputBoxInput.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') this.inputBoxInput.blur();
        });

        if ('phLocValue' in options) this.#mainApp.loc.bindSimpleEl(this.inputBoxInput, options.phLocValue);
        else if ('phText' in options) this.inputBoxInput.innerText = options.phText;
    }
}
