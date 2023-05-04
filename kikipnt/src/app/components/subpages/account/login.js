import { Subpage } from '../base';
import { QuickButton, qbStyles } from '../../common/quickButton';
import { MainApp } from '../../../main';
import { QuickInput } from '../../common/quickInput';

export class SubpageAccountLogin extends Subpage {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        const rootContainer = document.createElement('div');
        super('accountlogin', '#/account/login', rootContainer, mainApp);
        this.#mainApp = mainApp;

        this.rootContainer.classList.add('space-y-2', 'flex', 'flex-col', 'w-full', 'items-center');

        const form = document.createElement('form');
        form.classList.add('space-y-2', 'flex', 'flex-col', 'mt-2', 'sm:w-96', 'w-full');
        this.rootContainer.appendChild(form);

        const usernameInput = new QuickInput(
            { icon: 'account_circle', phLocValue: 'ui.generic.username' },
            this.#mainApp
        );
        form.appendChild(usernameInput.rootEl);

        const passwordInput = new QuickInput({ icon: 'key', phLocValue: 'ui.generic.password' }, this.#mainApp);
        passwordInput.inputBoxInput.type = 'password';
        form.appendChild(passwordInput.rootEl);

        // https://stackoverflow.com/questions/28709146/form-with-two-inputs-not-submitting
        // gumb je tu, sakriven, samo da submit radi
        const submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.classList.add('hidden');
        form.appendChild(submitButton);

        const loginBtn = new QuickButton(
            {
                locValue: 'ui.generic.log_in',
                icon: 'login',
                styles: [
                    qbStyles.classic,
                    {
                        content: ['bg-nord-10'],
                        icon: ['text-nord-6'],
                        text: ['text-nord-6'],
                    },
                ],
                clickEvent: () => {
                    this.#mainApp.firebaseInterface
                        .logIn(usernameInput.inputBoxInput.value, passwordInput.inputBoxInput.value)
                        .then((result) => resolvePromise(result));
                },
            },
            this.#mainApp
        );
        form.appendChild(loginBtn.buttonEl);

        const registerBtn = new QuickButton(
            {
                locValue: 'ui.generic.register',
                icon: 'person_add',
                styles: [qbStyles.alt],
                clickEvent: () => {
                    this.#mainApp.firebaseInterface
                        .register(usernameInput.inputBoxInput.value, passwordInput.inputBoxInput.value)
                        .then((result) => resolvePromise(result));
                },
            },
            this.#mainApp
        );
        form.appendChild(registerBtn.buttonEl);

        const resultSpan = document.createElement('span');
        resultSpan.classList.add('hidden');
        this.#mainApp.loc.bindSimpleEl(resultSpan, `ui.sp.accountlogin.failure`);
        form.appendChild(resultSpan);

        /**
         * @param {{
         *     code: string,
         *     success: boolean
         * }} result
         */
        const resolvePromise = (result) => {
            if (result.success) {
                location.hash = '#/account';
                resultSpan.classList.add('hidden');
            } else {
                resultSpan.classList.remove('hidden');
            }
        };

        form.onsubmit = () => {
            this.#mainApp.firebaseInterface
                .logIn(usernameInput.inputBoxInput.value, passwordInput.inputBoxInput.value)
                .then((result) => resolvePromise(result));
            return false;
        };
    }
}
