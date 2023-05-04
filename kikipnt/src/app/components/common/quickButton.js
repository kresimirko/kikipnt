import { MainApp } from '../../main';

export const qbStyles = {
    /** @type {import('../../types').QuickButtonStyle} */
    classic: {
        content: [
            'flex',
            'items-center',
            'space-x-1',
            'cursor-default',
            'rounded-md',
            'p-2',
            'hover:brightness-90',
            'active:brightness-75',
            'dark:highlight',
            'grow',
            'transition',
        ],
        icon: ['material-symbols-rounded'],
        text: ['text-sm', 'block', 'text-left'],
        root: ['rounded-md', 'pretty-focus', 'flex'],
        rightIcon: ['material-symbols-rounded', '!ml-auto'],
    },
    /** @type {import('../../types').QuickButtonStyle} */
    alt: {
        content: [
            'flex',
            'items-center',
            'space-x-1',
            'cursor-default',
            'rounded-md',
            'p-1',
            'hover:bg-[#bac1d1]/90',
            'dark:hover:bg-nord-3/90',
            'active:brightness-95',
            'dark:active:brightness-100',
            'dark:active:bg-nord-2',
            'grow',
            'transition',
            'min-w-0',
        ],
        icon: ['material-symbols-rounded'],
        text: ['text-sm', 'block', 'text-left'],
        root: ['rounded-md', 'pretty-focus', 'flex'],
        rightIcon: ['material-symbols-rounded', '!ml-auto'],
    },
};

export class QuickButton {
    #mainApp;

    /**
     * @param {import('../../types').QuickButtonOptions} options
     * @param {MainApp} mainApp
     */
    constructor(options, mainApp) {
        this.#mainApp = mainApp;

        /** @type {import('../../types').QuickButtonElements} */
        this.elements = {
            root: document.createElement(options.link ? 'a' : 'button'),
            content: document.createElement('div'),
            icon: document.createElement('span'),
            text: document.createElement('span'),
            rightIcon: document.createElement('span'),
        };

        this.buttonEl = this.elements.root; // TODO: ukloni kasnije!!

        this.elements.root.setAttribute('role', 'button');
        this.elements.text.setAttribute('aria-hidden', 'true');

        this.elements.root.appendChild(this.elements.content);

        if (options.icon) {
            // provjeravamo postoji li property
            this.elements.icon.innerText = options.icon;
            this.elements.content.appendChild(this.elements.icon);
        }

        if (options.locValue) {
            this.#mainApp.loc.bindSimpleElAriaLabel(this.elements.root, options.locValue);
            this.#mainApp.loc.bindSimpleEl(this.elements.text, options.locValue);
            if (options.bindToStatusLabel)
                this.#mainApp.statusLabel.addLoc(
                    this.elements.root,
                    options.locValue,
                    options.statusLabelClearOnClick ? true : false
                );

            this.elements.content.appendChild(this.elements.text);
        } else if (options.text) {
            this.elements.text.innerText = options.text;
            this.elements.root.setAttribute('aria-label', options.text);
            if (options.bindToStatusLabel)
                this.#mainApp.statusLabel.addBasic(
                    this.elements.root,
                    options.text,
                    options.statusLabelClearOnClick ? true : false
                );

            this.elements.content.appendChild(this.elements.text);
        }

        if (options.rightIcon) {
            this.elements.rightIcon.innerText = options.rightIcon;
            this.elements.content.appendChild(this.elements.rightIcon);
        }

        if (options.styles) options.styles.forEach((style) => this.applyStyle(style));

        if (options.clickEvent) this.elements.root.addEventListener('click', options.clickEvent);

        if (options.link && 'href' in this.elements.root) {
            this.elements.root.href = options.link;
            this.elements.root.draggable = false;
        } else {
            // https://stackoverflow.com/a/56755563/14558305
            this.elements.root.type = 'button';
        }
    }

    /** @param {import('../../types').QuickButtonStyle} style */
    applyStyle(style) {
        // javna funkcija ako je ikad potrebno promijeniti style izvana, nije moguće izbrisati prethodne!
        for (const element in style) {
            if (Object.keys(this.elements).includes(element)) {
                style[element].forEach(
                    /** @param {string} className */
                    (className) => this.elements[element].classList.add(className)
                );
            }
        }
    }

    clearStyles() {
        for (const element in this.elements) {
            this.elements[element].classList.remove(...this.elements[element].classList);
        }
    }
}
