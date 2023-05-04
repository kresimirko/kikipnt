import { MainApp } from './main';

export class ThemeManager {
    #mainApp;

    #autoTheme = true;
    #currentThemeIsDark = false;
    #html = document.getElementsByTagName('html')[0];

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        this.#mainApp = mainApp;

        if (this.#autoTheme) this.checkSystemThemeAndApply(); // odmah provjeravamo temu

        // https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript/57795495
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            this.checkSystemThemeAndApply();
        });

        this.#mainApp.events.target.addEventListener('settingschanged', () => {
            this.setThemeByName(this.#mainApp.storage.safeGet('theme'));
        });
        this.setThemeByName(this.#mainApp.storage.safeGet('theme'));
    }

    /**
     * @param {string} name
     */
    setThemeByName(name) {
        switch (name) {
            case 'light':
                this.#onThemeChange(false);
                break;
            case 'dark':
                this.#onThemeChange(true);
                break;
            case 'auto':
                this.#autoTheme = true;
                this.checkSystemThemeAndApply();
                break;
        }
    }

    checkSystemThemeAndApply() {
        this.#onThemeChange(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    isCurrentThemeDark() {
        return this.#currentThemeIsDark;
    }

    /**
     * @param {Boolean} isDark
     */
    #onThemeChange = (isDark) => {
        this.#currentThemeIsDark = isDark;
        isDark ? this.#html.classList.add('dark') : this.#html.classList.remove('dark');

        // https://stackoverflow.com/questions/61508409/how-to-change-tailwind-config-js-dynamically-based-on-user-settings-in-rails

        if (this.#mainApp.storage.safeGet('blur_enabled')) {
            document.documentElement.style.setProperty('--blur-var', '8px');
        } else {
            document.documentElement.style.setProperty('--blur-var', '0');
        }

        if (this.#mainApp.storage.safeGet('dark_tiles') && isDark) {
            document.documentElement.style.setProperty(
                '--filter-tiles',
                'invert(1) hue-rotate(200deg) saturate(0.7) brightness(1.2) contrast(0.8)'
            );
            document.documentElement.style.setProperty('--map-bg', '#292924');
        } else {
            document.documentElement.style.setProperty('--filter-tiles', 'invert(0)');
            document.documentElement.style.setProperty('--map-bg', '#f2efe9');
        }

        this.#mainApp.events.quick.settings.themeChanged(isDark);
    };
}
