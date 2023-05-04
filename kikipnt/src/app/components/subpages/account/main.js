import { Subpage } from '../base';
import { QuickButton, qbStyles } from '../../common/quickButton';
import { MainApp } from '../../../main';

export class SubpageAccount extends Subpage {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        const rootContainer = document.createElement('div');
        super('account', '#/account', rootContainer, mainApp);
        this.#mainApp = mainApp;

        this.rootContainer.classList.add('space-y-2', 'md:container', 'md:mx-auto');

        const accNameDiv = document.createElement('div');
        accNameDiv.classList.add('hidden');
        this.rootContainer.appendChild(accNameDiv);

        const accNamePreLabel = document.createElement('span');
        accNamePreLabel.classList.add('text-md');
        this.#mainApp.loc.bindSimpleEl(accNamePreLabel, 'ui.sp.account.logged_in_as');
        accNameDiv.appendChild(accNamePreLabel);

        const accNameLabel = document.createElement('span');
        accNameLabel.classList.add('text-md', 'text-nord-10', 'ml-1');
        accNameLabel.innerText = 'somebody';
        accNameDiv.appendChild(accNameLabel);

        const accBenefits = document.createElement('span');
        accBenefits.classList.add('block', 'grow-0');
        this.#mainApp.loc.bindSimpleEl(accBenefits, 'ui.sp.account.benefits');
        this.rootContainer.appendChild(accBenefits);

        const logInBtn = new QuickButton(
            {
                locValue: 'ui.generic.log_in',
                icon: 'login',
                styles: [qbStyles.alt, { root: ['w-full', 'md:whitespace-nowrap', 'md:max-w-min'] }],
                link: '#/account/login',
            },
            this.#mainApp
        );
        this.rootContainer.appendChild(logInBtn.buttonEl);

        const logOutBtn = new QuickButton(
            {
                locValue: 'ui.generic.log_out',
                icon: 'logout',
                styles: [qbStyles.alt, { root: ['hidden', 'w-full', 'md:whitespace-nowrap', 'md:max-w-min'] }],
                clickEvent: () => {
                    this.#mainApp.firebaseInterface.logOut();
                },
            },
            this.#mainApp
        );
        this.rootContainer.appendChild(logOutBtn.buttonEl);

        const onLogIn = () => {
            logInBtn.elements.root.classList.add('hidden');
            logOutBtn.elements.root.classList.remove('hidden');
            accNameDiv.classList.remove('hidden');
            accBenefits.classList.add('hidden');
            accNameLabel.innerText = this.#mainApp.firebaseInterface.username;
        };

        const onLogOut = () => {
            logInBtn.elements.root.classList.remove('hidden');
            logOutBtn.elements.root.classList.add('hidden');
            accNameDiv.classList.add('hidden');
            accBenefits.classList.remove('hidden');
        };

        this.#mainApp.events.target.addEventListener('loggedin', onLogIn);
        this.#mainApp.events.target.addEventListener('loggedout', onLogOut);
    }
}
