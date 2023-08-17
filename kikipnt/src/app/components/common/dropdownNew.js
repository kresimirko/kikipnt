import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { qbStyles, QuickButton } from './quickButton';
import { MainApp } from '../../main';

export class DropdownNew {
    #mainApp;
    #cleanup;

    /**
     * @param {MainApp} mainApp
     * @param {HTMLElement} refElement
     * @param {import('../../types').DropdownNewOptions} options
     */
    constructor(mainApp, refElement, options) {
        this.#mainApp = mainApp;

        this.mainDropdownElement = document.createElement('div');
        this.mainDropdownElement.classList.add(
            !options.fitSize && 'max-w-max',
            'absolute',
            'top-0',
            'left-0',
            'z-20',
            'hidden',
            'rounded-lg',
            'bg-nord-6/90',
            'dark:bg-nord-1/90',
            'ring-simple',
            'backdrop-blur-variable',
            'shadow-lg',
            'p-2'
        );
        if (options && options.extraClasses) {
            options.extraClasses.forEach((classToken) => {
                this.mainDropdownElement.classList.add(classToken);
            });
        }
        document.body.appendChild(this.mainDropdownElement);

        this.title = document.createElement('div');
        this.title.classList.add('text-nord-3/50', 'dark:text-nord-4/50', 'text-sm', 'mb-2');

        if (options && options.title) {
            this.mainDropdownElement.appendChild(this.title);
            if (options.title.locValue) {
                if (this.#mainApp) {
                    const onLangChange = () => {
                        this.title.innerText = this.#mainApp.loc.tr(options.title.locValue);
                    };
                    onLangChange();

                    this.#mainApp.events.target.addEventListener('langchange', onLangChange);
                } else {
                    throw new Error('DropdownNew | mainApp not provided, cannot use loc');
                }
            } else if (options.title.text) {
                this.title.innerText = options.title.text;
            }
        }

        this.itemContainer = document.createElement('div');
        this.itemContainer = document.createElement('div');
        this.itemContainer.classList.add('flex', 'flex-col');
        this.mainDropdownElement.appendChild(this.itemContainer);

        if (options.initialItems) {
            for (const item of options.initialItems) {
                const qb = this.addAction(item);
            }
        }

        if (!options.triggerType || options.triggerType == 'click') {
            refElement.addEventListener('click', () => {
                this.show();
            });
        }

        // https://floating-ui.com/docs/tutorial
        // cleanup je ovdje, ali ga se ne bi trebalo zvati
        this.#cleanup = autoUpdate(refElement, this.mainDropdownElement, () => {
            computePosition(refElement, this.mainDropdownElement, {
                placement: options.placement ? options.placement : 'bottom-start',
                middleware: [offset(8), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
                Object.assign(this.mainDropdownElement.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });
            });
        });

        // https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element
        // ako fokus ili klik nije niti na refElement (gumb ili sl.) niti na sam dropdown onda se skriva
        /** @param {Event} event */
        this.closeIfInactive = (event) => {
            const eventTargets = event.composedPath();
            if (!(eventTargets.includes(this.mainDropdownElement) || eventTargets.includes(refElement))) this.hide();
        };

        this.autoHide = !options.disableAutoHide;
        this.refElement = refElement;
    }

    /** @param {import('../../types').QuickButtonOptions} item */
    addAction(item) {
        const qb = new QuickButton(
            {
                // https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object
                ...(item.text && { text: item.text }),
                ...(item.locValue && { locValue: item.locValue }),
                ...(item.icon && { icon: item.icon }),
                ...(item.rightIcon && { rightIcon: item.rightIcon }),
                styles: [qbStyles.alt],
                ...(item.link && { link: item.link }),
                bindToStatusLabel: item.bindToStatusLabel ? true : false,
                statusLabelClearOnClick: item.statusLabelClearOnClick ? true : false,
                ...(item.clickEvent && { clickEvent: item.clickEvent }),
            },
            this.#mainApp
        );
        qb.buttonEl.addEventListener('click', () =>
            setTimeout(() => {
                this.hide();
            }, 50)
        );
        this.itemContainer.appendChild(qb.buttonEl);

        return qb;
    }

    show() {
        this.mainDropdownElement.classList.remove('hidden');
        if (this.autoHide) {
            document.addEventListener('click', this.closeIfInactive);
            document.addEventListener('focusin', this.closeIfInactive);
            document.addEventListener('focusout', this.closeIfInactive);
        }
    }

    hide() {
        this.mainDropdownElement.classList.add('hidden');
        // this.#cleanup();
        if (this.autoHide) {
            document.removeEventListener('click', this.closeIfInactive);
            document.removeEventListener('focusin', this.closeIfInactive);
            document.removeEventListener('focusout', this.closeIfInactive);
        }
        setTimeout(() => {
            this.refElement.focus();
        }, 50);
    }

    isVisible() {
        return this.mainDropdownElement.classList.contains('hidden');
    }
}
