import { LocalizationManager } from './localizationMgr';
import { MainAppWrapper } from './components/wrapper';
import { ThemeManager } from './themeManager';
import { StatusLabel } from './components/header/statusLabel';
import { icon, latLng } from 'leaflet';
import store from 'store2';
import defaultSettings from './assets/defaultSettings.json';

export class MainApp {
    constructor() {
        // https://stackoverflow.com/questions/41144319/leaflet-marker-not-found-production-env
        const llmShadowUrl = new URL(
            '../../node_modules/leaflet/dist/images/marker-shadow.png',
            import.meta.url
        ).toString();
        const llmIconRetinaUrl = new URL(
            '../../node_modules/leaflet/dist/images/marker-icon-2x.png',
            import.meta.url
        ).toString();
        const llmIconUrl = new URL(
            '../../node_modules/leaflet/dist/images/marker-icon.png',
            import.meta.url
        ).toString();
        const llmIconRetinaUrlUndef = new URL(
            './assets/img/custom_markers/undef/marker-icon-2x.png',
            import.meta.url
        ).toString();
        const llmIconUrlFavUndef = new URL(
            './assets/img/custom_markers/undef/marker-icon.png',
            import.meta.url
        ).toString();

        // dijeljeno i dostupno većini klasa
        this.consts = {
            appName: process.env.APP_NAME,
            appVersion: process.env.APP_VERSION,
            lightLogoURL: new URL('./assets/img/logo/kikipnt.svg', import.meta.url),
            darkLogoURL: new URL('./assets/img/logo/kikipnt_dark.svg', import.meta.url),
            miniLogoURL: new URL('./assets/img/logo/kikipnt_favicon.svg', import.meta.url),
            leaflet: {
                iconDefault: icon({
                    iconRetinaUrl: llmIconRetinaUrl,
                    iconUrl: llmIconUrl,
                    shadowUrl: llmShadowUrl,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [41, 41],
                }),
                iconUndef: icon({
                    iconRetinaUrl: llmIconRetinaUrlUndef,
                    iconUrl: llmIconUrlFavUndef,
                    shadowUrl: llmShadowUrl,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [41, 41],
                }),
                mainLatLng: latLng(45.816, 15.976), // Zagreb
                defaultMapOptions: {
                    center: latLng(0, 0),
                    zoom: 2,
                },
                defaultTileLayerUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                defaultTileLayerOptions: {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                },
                // key treba staviti u .env (ili u .env.local i sl.)
                retinaTileLayerUrl: 'https://retina-tiles.p.rapidapi.com/local/osm{r}/v1/{z}/{x}/{y}.png?rapidapi-key=' + process.env.API_KEY_RETINA_TILES,
                retinaTileLayerOptions: {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://www.maptilesapi.com/retina-tiles/">Retina Tiles</a>',
                },
            },
        };

        // https://stackoverflow.com/questions/3646036/preloading-images-with-javascript
        new Image().src = this.consts.lightLogoURL.toString();
        new Image().src = this.consts.darkLogoURL.toString();
        new Image().src = this.consts.miniLogoURL.toString();

        this.storage = {
            /**
             * @param {import('./types').StorageKeys} key
             * @param {any} data
             */
            safeSet: (key, data) => {
                store.set('user.' + key, data);
            },
            /** @param {import('./types').StorageKeys} key */
            safeGet: (key) => {
                const keyR = store.get('user.' + key);
                if (keyR !== null) {
                    return keyR;
                } else {
                    store.set('user.' + key, defaultSettings[key]);
                    return defaultSettings[key];
                }
            },
        };

        this.events = {
            target: new EventTarget(),
            // safe eventovi, komponente ne koriste ili rijetko koriste sirov eventTarget za slanje
            quick: {
                settings: {
                    allChanged: () => {
                        this.events.target.dispatchEvent(new CustomEvent('settingschanged'));
                    },
                    /**
                     * @param {boolean} isDark
                     */
                    themeChanged: (isDark) => {
                        this.events.target.dispatchEvent(new CustomEvent('themechanged', { detail: { isDark } }));
                    },
                    langChanged: () => {
                        this.events.target.dispatchEvent(new CustomEvent('langchange'));
                    },
                },
                search: {
                    /**
                     * @param {string} query
                     * @param {boolean} [preventHistoryAdd]
                     */
                    byText: (query, preventHistoryAdd) => {
                        this.events.target.dispatchEvent(
                            new CustomEvent('searched', {
                                detail: {
                                    type: 'text',
                                    data: { query: query, preventHistoryAdd: preventHistoryAdd ? true : false },
                                },
                            })
                        );
                    },
                    /**
                     * @param {string | number} lat
                     * @param {string | number} lon
                     * @param {string | number} zoom
                     * @param {boolean} [keepMarkers]
                     */
                    byCoords: (lat, lon, zoom, keepMarkers) => {
                        this.events.target.dispatchEvent(
                            new CustomEvent('searched', {
                                detail: {
                                    type: 'map',
                                    data: { lat, lon, zoom, keepMarkers },
                                },
                            })
                        );
                    },
                },
                subpage: {
                    collectionRefreshed: () => {
                        this.events.target.dispatchEvent(new CustomEvent('subpagecollectionrefreshed'));
                    },
                },
                easterEgg: () => {
                    this.events.target.dispatchEvent(new CustomEvent('easteregg'));
                },
                /** @param {string} name */
                addToHistory: (name) => {
                    // jedina event funkcija koja radi i nešto drugo
                    /** @type {string[]} */
                    let historyArray = store.get('user.history');
                    if (historyArray) {
                        historyArray.unshift(name);
                        store.set('user.history', historyArray);
                    } else {
                        store.set('user.history', [name]);
                    }
                    this.events.target.dispatchEvent(new CustomEvent('addedtohistory', { detail: name }));
                },
                clearHistory: () => {
                    this.events.target.dispatchEvent(new CustomEvent('historycleared'));
                },
                refreshHistory: () => {
                    this.events.target.dispatchEvent(new CustomEvent('historyrefreshed'));
                },
            },
        };

        this.loc = new LocalizationManager(this);

        this.statusLabel = new StatusLabel(this);

        this.themeManager = new ThemeManager(this);

        const appContainer = document.getElementById('app');
        const wrapper = new MainAppWrapper(this);
        appContainer.appendChild(wrapper.rootEl);
    }

    /**
     * @param {{
     *     key: import('./types').StorageKeys,
     *     optionList: {
     *         value: string,
     *         text?: string,
     *         locValue?: import('./types').LanguageValues,
     *     }[],
     * }} options
     */
    createOptionsRadio(options) {
        const container = document.createElement('div');
        container.classList.add('space-y-1');

        for (const option of options.optionList) {
            const optionContainer = document.createElement('div');
            optionContainer.classList.add('space-x-1', 'pr-1', 'max-w-max');
            container.appendChild(optionContainer);

            const optionId = option.value + 'radio';

            const optionRadio = document.createElement('input');
            optionRadio.classList.add('!ring-offset-0', '!ring-0', 'text-nord-10', 'pointer-events-none');
            optionRadio.type = 'radio';
            optionRadio.name = options.key;
            optionRadio.value = option.value;
            if (this.storage.safeGet(options.key) === option.value) optionRadio.checked = true;
            optionRadio.id = optionId;
            optionContainer.appendChild(optionRadio);

            const optionLabel = document.createElement('label');
            optionLabel.classList.add('pointer-events-none');
            optionLabel.htmlFor = optionId;
            if (option.locValue) this.loc.bindSimpleEl(optionLabel, option.locValue);
            else if (option.text) optionLabel.innerText = option.text;
            optionContainer.appendChild(optionLabel);

            optionContainer.addEventListener('click', (event) => {
                event.preventDefault();
                optionRadio.checked = true;
                this.storage.safeSet(options.key, option.value);
                this.events.quick.settings.allChanged();
            });
        }

        return container;
    }

    /**
     * @param {{
     *     key: import('./types').StorageKeys,
     *     text?: string,
     *     locValue?: import('./types').LanguageValues,
     * }[]} optionList
     */
    createOptionsCheckbox(optionList) {
        const container = document.createElement('div');
        container.classList.add('space-y-1');

        for (const option of optionList) {
            const optionContainer = document.createElement('div');
            optionContainer.classList.add('space-x-1', 'pr-1', 'max-w-max');
            container.appendChild(optionContainer);

            const optionId = option.key + 'checkbox';

            const optionCheckbox = document.createElement('input');
            optionCheckbox.classList.add('!ring-offset-0', '!ring-0', 'text-nord-10', 'rounded', 'pointer-events-none');
            optionCheckbox.type = 'checkbox';
            optionCheckbox.name = option.key;
            optionCheckbox.value = option.key;
            if (this.storage.safeGet(option.key) === true) optionCheckbox.checked = true;
            optionCheckbox.id = optionId;
            optionContainer.appendChild(optionCheckbox);

            const optionLabel = document.createElement('label');
            optionLabel.classList.add('pointer-events-none');
            optionLabel.htmlFor = optionId;
            if (option.locValue) this.loc.bindSimpleEl(optionLabel, option.locValue);
            else if (option.text) optionLabel.innerText = option.text;
            optionContainer.appendChild(optionLabel);

            optionContainer.addEventListener('click', (event) => {
                event.preventDefault();
                optionCheckbox.checked = !optionCheckbox.checked;
                this.storage.safeSet(option.key, optionCheckbox.checked);
                this.events.quick.settings.allChanged();
            });
        }

        return container;
    }
}

const mainApp = new MainApp();
