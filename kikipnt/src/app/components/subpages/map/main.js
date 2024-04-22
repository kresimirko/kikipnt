import { Map, Marker, TileLayer, latLng, control } from 'leaflet';
import { Subpage } from '../base';
import { Spinner } from '../../common/spinner';
import { QuickInput } from '../../common/quickInput';
import { QuickButton, qbStyles } from '../../common/quickButton';
import { MainApp } from '../../../main';
import store from 'store2';

export class SubpageMap extends Subpage {
    #mainApp;

    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        const rootContainer = document.createElement('div');
        super('map', '#/map', rootContainer, mainApp);
        this.#mainApp = mainApp;

        this.rootContainer.classList.add('h-full', 'relative', 'flex', 'flex-col', 'md:flex-row');

        const sidebarContainer = document.createElement('div');
        sidebarContainer.classList.add('mb-2', 'md:mb-0', 'md:mr-2', 'flex', 'flex-col', 'md:flex-row');
        this.rootContainer.appendChild(sidebarContainer);

        const searchForm = document.createElement('form');
        searchForm.classList.add('grow', 'min-w-0');
        sidebarContainer.appendChild(searchForm);

        const searchInputWithButtonContainer = document.createElement('div');
        searchInputWithButtonContainer.classList.add('flex', 'md:hidden');
        searchForm.appendChild(searchInputWithButtonContainer);

        const searchInput = new QuickInput({ icon: 'search', phLocValue: 'ui.searchbox.label' }, this.#mainApp);
        searchInput.rootEl.classList.add('w-full');
        searchInputWithButtonContainer.appendChild(searchInput.rootEl);

        searchForm.onsubmit = () => {
            setTimeout(() => {
                this.#mainApp.events.quick.search.byText(searchInput.inputBoxInput.value);
            }, 50);
            return false;
        };

        this.#mainApp.events.target.addEventListener('easteregg', () => {
            if (searchInput.inputBoxInput.value === 'niko') {
                setTimeout(() => {
                    location.hash = '#/about/easteregg';
                }, 10);
            }
        });

        const searchButton = new QuickButton(
            {
                icon: 'search',
                styles: [qbStyles.alt, { root: ['md:mt-2', 'ml-2', 'w-min'] }],
                clickEvent: () => {
                    this.#mainApp.events.quick.search.byText(searchInput.inputBoxInput.value);
                },
            },
            this.#mainApp
        );
        this.#mainApp.loc.bindSimpleElTitle(searchButton.buttonEl, 'ui.generic.search');
        searchInputWithButtonContainer.appendChild(searchButton.buttonEl);

        const sidebarContent = document.createElement('div');
        sidebarContent.classList.add('flex', 'flex-col', 'grow', 'mb-2', 'md:mb-0', 'md:mr-2', 'md:w-72');
        sidebarContainer.appendChild(sidebarContent);

        const sidebarLargeScreenContainer = document.createElement('div');
        sidebarLargeScreenContainer.classList.add('grow', 'hidden', 'md:flex', 'flex-col', 'overflow-auto');
        sidebarContent.appendChild(sidebarLargeScreenContainer);

        const sidebarCollapse = new QuickButton(
            {
                styles: [
                    qbStyles.alt,
                    {
                        text: ['hidden'],
                        content: ['justify-center', 'h-full'],
                        root: ['hidden', 'md:block'],
                    },
                ],
                icon: 'chevron_left',
                clickEvent: () => {
                    sidebarContent.classList.toggle('hidden');
                },
            },
            this.#mainApp
        );
        sidebarContainer.appendChild(sidebarCollapse.buttonEl);

        const updateCollapseBtnIcon = () => {
            const contIsHidden = sidebarContent.classList.contains('hidden');
            sidebarCollapse.elements.icon.innerText = contIsHidden ? 'chevron_right' : 'chevron_left';
        };
        sidebarCollapse.buttonEl.addEventListener('click', updateCollapseBtnIcon);
        updateCollapseBtnIcon();

        const sidebarHistoryTitle = document.createElement('span');
        sidebarHistoryTitle.classList.add('font-bold', 'text-2xl', 'mt-3', 'sm:mt-0');
        this.#mainApp.loc.bindSimpleEl(sidebarHistoryTitle, 'ui.sp.history.title');
        sidebarLargeScreenContainer.appendChild(sidebarHistoryTitle);

        const historyNoneYetLabel = document.createElement('div');
        historyNoneYetLabel.classList.add('text-sm', 'block');
        this.#mainApp.loc.bindSimpleEl(historyNoneYetLabel, 'ui.generic.nothing_here_yet');
        sidebarLargeScreenContainer.appendChild(historyNoneYetLabel);

        const historyTextNotice = document.createElement('span');
        historyTextNotice.classList.add('text-sm', 'opacity-60', 'block');
        this.#mainApp.loc.bindSimpleEl(historyTextNotice, 'ui.sp.history.text_notice');
        sidebarLargeScreenContainer.appendChild(historyTextNotice);

        const sidebarHistoryContainer = document.createElement('div');
        sidebarHistoryContainer.classList.add(
            'max-w-full',
            'grow',
            'hidden',
            'md:flex',
            'flex-col',
            'mt-1',
            'overflow-auto'
        );
        sidebarLargeScreenContainer.appendChild(sidebarHistoryContainer);

        /** @param {string} name */
        const createHistoryButton = (name) => {
            return new QuickButton(
                {
                    icon: 'history',
                    rightIcon: 'arrow_forward',
                    text: `${name}`,
                    styles: [qbStyles.alt, { text: ['truncate'] }],
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
            historyNoneYetLabel.classList.add('hidden');
            existingHistory.forEach((name) => {
                sidebarHistoryContainer.appendChild(createHistoryButton(name).buttonEl);
            });
        }

        this.#mainApp.events.target.addEventListener(
            'addedtohistory',
            /** @param {CustomEvent} event */ (event) => {
                historyNoneYetLabel.classList.add('hidden');
                sidebarHistoryContainer.prepend(createHistoryButton(event.detail).buttonEl);
            }
        );

        this.#mainApp.events.target.addEventListener(
            'historycleared',
            /** @param {CustomEvent} event */ (event) => {
                historyNoneYetLabel.classList.remove('hidden');
                sidebarHistoryContainer.innerHTML = '';
            }
        );

        this.#mainApp.events.target.addEventListener(
            'historyrefreshed',
            /** @param {CustomEvent} event */ (event) => {
                sidebarHistoryContainer.innerHTML = '';
                /** @type {string[]} */
                const newHistory = store.get('user.history');
                newHistory.forEach((name) => {
                    sidebarHistoryContainer.appendChild(createHistoryButton(name).buttonEl);
                });
            }
        );

        const spinner = new Spinner();
        spinner.spinner.classList.add('hidden', 'mt-4', 'md:mb-4', 'md:mt-0');
        sidebarContent.appendChild(spinner.spinner);

        const sidebarOpenHistory = new QuickButton(
            {
                locValue: 'ui.sp.map.open_history',
                styles: [qbStyles.alt, { root: ['hidden', 'md:block'] }],
                icon: 'history',
                link: '#/map/history',
            },
            this.#mainApp
        );
        sidebarContent.appendChild(sidebarOpenHistory.buttonEl);

        const mapEl = document.createElement('div');
        mapEl.classList.add('w-full', 'grow', 'z-0', 'rounded', 'overflow-hidden', 'border-2', 'border-[#778299]');
        this.rootContainer.appendChild(mapEl);

        const map = new Map(mapEl, {
            center: this.#mainApp.consts.leaflet.mainLatLng,
            zoom: 4,
            zoomControl: false,
        });

        const mainTileLayer = new TileLayer(
            this.#mainApp.consts.leaflet.defaultTileLayerUrl,
            this.#mainApp.consts.leaflet.defaultTileLayerOptions
        );
        const retinaTileLayer = new TileLayer(
            this.#mainApp.consts.leaflet.retinaTileLayerUrl,
            this.#mainApp.consts.leaflet.retinaTileLayerOptions
        );
        const removeAllTileLayers = () => {
            map.removeLayer(mainTileLayer);
            map.removeLayer(retinaTileLayer);
        }
        const setRetina = () => {
            removeAllTileLayers();
            if (this.#mainApp.storage.safeGet('retina_tiles') == 'auto') {
                let retina = window.devicePixelRatio > 1 ? true : false;
                retina ? retinaTileLayer.addTo(map) : mainTileLayer.addTo(map);
            } else if (this.#mainApp.storage.safeGet('retina_tiles') === 'always') {
                retinaTileLayer.addTo(map);
            } else if (this.#mainApp.storage.safeGet('retina_tiles') === 'never') {
                mainTileLayer.addTo(map);
            } else { // failsafe
                mainTileLayer.addTo(map);
            }
        };
        setRetina();
        this.#mainApp.events.target.addEventListener('settingschanged', () => {
            setRetina();
        });

        control
            .zoom({
                position: 'topright',
            })
            .addTo(map);
        control.scale().addTo(map);

        const flytoZoom = 14;

        let customMarkerAdded = false;
        const customMarker = new Marker(latLng(0, 0), {
            icon: this.#mainApp.consts.leaflet.iconUndef,
        });

        const customMarkerPopup = document.createElement('div');
        customMarkerPopup.classList.add('flex', 'justify-center');
        customMarker.bindPopup(customMarkerPopup);
        customMarker.addEventListener('popupclose', () => {
            setTimeout(() => {
                if (!customMarker.isPopupOpen()) {
                    customMarker.remove();
                    customMarkerAdded = false;
                }
            }, 50);
        });

        /** @param {import('leaflet').LeafletMouseEvent} event */
        const mapClickEvent = (event) => {
            if (!customMarkerAdded) {
                customMarker.addTo(map);
                customMarkerAdded = true;
            }
            customMarker.setLatLng(event.latlng);
            customMarker.openPopup();
        };

        const customMarkerPopupSearchButton = new QuickButton(
            {
                icon: 'search',
                locValue: 'ui.sp.map.marker.search_here',
                styles: [qbStyles.alt, { root: ['grow'], text: ['hidden'], content: ['justify-center'] }],
                clickEvent: () => {
                    this.#mainApp.events.quick.search.byCoords(
                        customMarker.getLatLng().lat,
                        customMarker.getLatLng().lng,
                        Math.floor(map.getZoom() + 1) // ponekad ovaj zbroj zna izbaciti float pa je ovo failsafe... valjda
                    );
                },
                bindToStatusLabel: true,
                statusLabelClearOnClick: true,
            },
            this.#mainApp
        );
        customMarkerPopup.appendChild(customMarkerPopupSearchButton.buttonEl);

        map.on('click', mapClickEvent);

        // https://stackoverflow.com/questions/49475795/resize-event-not-triggered-on-div
        new ResizeObserver(() => map.invalidateSize()).observe(mapEl);

        const afterSearch = () => {
            spinner.spinner.classList.add('hidden');
        };

        this.#mainApp.events.target.addEventListener(
            'searched',
            /** @param {CustomEvent} event */
            (event) => {
                customMarkerAdded = false;
                customMarker.remove();
                spinner.spinner.classList.remove('hidden');

                location.hash = '#/map';
                switch (event.detail.type) {
                    case 'text':
                        if (event.detail.data.query) {
                            let newQuery = event.detail.data.query;
                            let queryArray = event.detail.data.query.split('');
                            let usingAddressSearch = false;
                            if (queryArray[0] === '$') {
                                queryArray.shift();
                                usingAddressSearch = true; // ako je $ na početku onda radimo address search
                            }
                            newQuery = queryArray.join('');
                            if (!event.detail.data.preventHistoryAdd)
                                this.#mainApp.events.quick.addToHistory(event.detail.data.query);
                            fetch(
                                usingAddressSearch
                                    ? `https://nominatim.openstreetmap.org/lookup?osm_ids=${newQuery}&format=jsonv2`
                                    : `https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=${newQuery}`
                            )
                                .then((response) => response.json())
                                .then((responseJsonList) =>
                                    handleResponse({
                                        type: 'text',
                                        typeTextResponse: responseJsonList,
                                        keepMarkers: event.detail.data.keepMarkers ? true : false,
                                    })
                                )
                                .catch((error) => {
                                    console.error(error);
                                    alert(this.#mainApp.loc.tr('ui.sp.map.an_error_occurred') + error);
                                    afterSearch();
                                });
                            console.log('to history: ' + event.detail.data.query);
                        } else {
                            afterSearch();
                        }
                        break;
                    case 'map':
                        if (event.detail.data.lat && event.detail.data.lon && event.detail.data.zoom) {
                            const lat = event.detail.data.lat;
                            const lon = event.detail.data.lon;
                            const zoom = event.detail.data.zoom;
                            fetch(
                                `https://nominatim.openstreetmap.org/reverse.php?format=jsonv2&lat=${lat}&lon=${lon}&zoom=${zoom}`
                            )
                                .then((response) => response.json())
                                .then((responseJson) =>
                                    handleResponse({
                                        type: 'map',
                                        typeMapResponse: responseJson,
                                        keepMarkers: event.detail.data.keepMarkers ? true : false,
                                    })
                                )
                                .catch((error) => {
                                    console.error(error);
                                    alert('An error occurred!\n\n' + error);
                                    afterSearch();
                                });
                        } else {
                            afterSearch();
                        }
                        break;
                }
            }
        );

        this.#mainApp.events.target.addEventListener('subpagecollectionrefreshed', () => {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        });

        /**
         * @type {{
         *     marker: Marker,
         *     markerPopupFocusControls: HTMLDivElement,
         * }[]}
         */
        let existingMarkers = [];

        /** @param {{}} place */
        const handlePlace = (place) => {
            if (place['lat'] && place['lon']) {
                const placeLatLng = latLng(Number(place['lat']), Number(place['lon']));
                const marker = new Marker(placeLatLng, {
                    icon: this.#mainApp.consts.leaflet.iconDefault,
                }).addTo(map);

                const markerPopup = document.createElement('div');
                markerPopup.classList.add('flex', 'flex-col', 'space-y-1', 'text-sm', 'max-w-72', 'break-words');

                if (place['icon']) {
                    const markerPopupIcon = document.createElement('img');
                    markerPopupIcon.classList.add('brightness-0', 'dark:invert', 'opacity-90', 'block', 'max-w-min');
                    markerPopupIcon.src = place['icon'];
                    markerPopup.appendChild(markerPopupIcon);
                }

                const markerPopupPlaceName = document.createElement('span');
                markerPopupPlaceName.classList.add('font-bold', 'block', 'select-text', 'break-words');
                markerPopupPlaceName.innerText = place['display_name'];
                markerPopup.appendChild(markerPopupPlaceName);

                const markerPopupCategoryContainer = document.createElement('div');
                markerPopupCategoryContainer.classList.add('flex', 'flex-wrap', 'select-text');
                markerPopup.appendChild(markerPopupCategoryContainer);

                const markerPopupCategoryLabel = document.createElement('div');
                markerPopupCategoryLabel.classList.add('mr-1');
                this.#mainApp.loc.bindSimpleEl(markerPopupCategoryLabel, 'ui.sp.map.marker.category');
                markerPopupCategoryContainer.appendChild(markerPopupCategoryLabel);

                const markerPopupCategory = document.createElement('div');
                markerPopupCategory.classList.add('break-words');
                markerPopupCategory.innerText = place['category'];
                markerPopupCategoryContainer.appendChild(markerPopupCategory);

                const markerPopupTypeContainer = document.createElement('div');
                markerPopupTypeContainer.classList.add('flex', 'flex-wrap', 'select-text');
                markerPopup.appendChild(markerPopupTypeContainer);

                const markerPopupTypeLabel = document.createElement('div');
                markerPopupTypeLabel.classList.add('mr-1');
                this.#mainApp.loc.bindSimpleEl(markerPopupTypeLabel, 'ui.sp.map.marker.type');
                markerPopupTypeContainer.appendChild(markerPopupTypeLabel);

                const markerPopupType = document.createElement('div');
                markerPopupType.classList.add('break-words');
                markerPopupType.innerText = place['type'];
                markerPopupTypeContainer.appendChild(markerPopupType);

                const markerPopupCoordsContainer = document.createElement('div');
                markerPopupCoordsContainer.classList.add('flex', 'flex-wrap', 'select-text');
                markerPopup.appendChild(markerPopupCoordsContainer);

                const markerPopupCoordsLabel = document.createElement('div');
                markerPopupCoordsLabel.classList.add('mr-1');
                this.#mainApp.loc.bindSimpleEl(markerPopupCoordsLabel, 'ui.sp.map.marker.coords');
                markerPopupCoordsContainer.appendChild(markerPopupCoordsLabel);

                const markerPopupCoords = document.createElement('div');
                markerPopupCoords.classList.add('break-all');
                markerPopupCoords.innerText = `${parseFloat(place['lat'])}, ${parseFloat(
                    place['lon']
                )}`;
                markerPopupCoordsContainer.appendChild(markerPopupCoords);

                const placeId = place['osm_type'].split('')[0].toUpperCase() + place['osm_id'];

                markerPopup.appendChild(document.createElement('hr'));

                const markerPopupFocusControls = document.createElement('div');
                markerPopupFocusControls.classList.add('flex', 'items-center');
                markerPopup.appendChild(markerPopupFocusControls);

                const markerPopupPlaceId = document.createElement('span');
                markerPopupPlaceId.classList.add('block', 'opacity-60', '!mr-auto', 'text-xs', 'select-text');
                markerPopupPlaceId.innerText = placeId;
                markerPopupFocusControls.appendChild(markerPopupPlaceId);

                if (existingMarkers.length) {
                    const currPrev = existingMarkers[existingMarkers.length - 1];
                    const markerPopupFocusPrev = new QuickButton(
                        {
                            locValue: 'ui.sp.map.marker.focus_on_prev',
                            styles: [qbStyles.alt, { text: ['hidden'] }],
                            icon: 'arrow_back',
                            clickEvent: () => {
                                map.flyTo(currPrev.marker.getLatLng(), flytoZoom);
                                currPrev.marker.openPopup();
                            },
                            bindToStatusLabel: true,
                            statusLabelClearOnClick: true, // zbog nekog razloga tekst ne nestaje kad kursor izađe ako se automatski pana mapa
                        },
                        this.#mainApp
                    );
                    markerPopupFocusControls.appendChild(markerPopupFocusPrev.buttonEl);
                }

                const markerPopupFocus = new QuickButton(
                    {
                        locValue: 'ui.sp.map.marker.focus_on',
                        styles: [qbStyles.alt, { text: ['hidden'] }],
                        icon: 'my_location',
                        clickEvent: () => {
                            map.flyTo(placeLatLng, flytoZoom);
                        },
                        bindToStatusLabel: true,
                        statusLabelClearOnClick: true,
                    },
                    this.#mainApp
                );
                markerPopupFocusControls.appendChild(markerPopupFocus.buttonEl);

                if (existingMarkers.length) {
                    const currPrev = existingMarkers[existingMarkers.length - 1];
                    const markerPopupFocusNext = new QuickButton(
                        {
                            locValue: 'ui.sp.map.marker.focus_on_next',
                            styles: [qbStyles.alt, { text: ['hidden'] }],
                            icon: 'arrow_forward',
                            clickEvent: () => {
                                map.flyTo(placeLatLng, flytoZoom);
                                marker.openPopup();
                            },
                            bindToStatusLabel: true,
                            statusLabelClearOnClick: true,
                        },
                        this.#mainApp
                    );
                    currPrev.markerPopupFocusControls.appendChild(markerPopupFocusNext.buttonEl);
                }

                marker.bindPopup(markerPopup);
                if (existingMarkers.length === 0) marker.openPopup();

                existingMarkers.push({ marker, markerPopupFocusControls });

                return placeLatLng;
            } else {
                return false;
            }
        };

        // https://nominatim.org/release-docs/latest/api/Output/
        /**
         * @param {{
         *     type: 'text' | 'map'
         *     typeTextResponse?: {}[]
         *     typeMapResponse?: {}
         *     keepMarkers?: boolean,
         * }} resInfo
         */
        const handleResponse = (resInfo) => {
            console.log(resInfo);
            if (!resInfo.keepMarkers) {
                for (const markerObj of existingMarkers) {
                    markerObj.marker.remove();
                }
                existingMarkers = [];
            }

            switch (resInfo.type) {
                case 'text':
                    let firstPlaceLatLngSet = false;
                    for (const place of resInfo.typeTextResponse) {
                        const placeLatLng = handlePlace(place);

                        if (!firstPlaceLatLngSet) {
                            if (placeLatLng) map.flyTo(placeLatLng, flytoZoom);
                            firstPlaceLatLngSet = true;
                        }
                    }
                    break;
                case 'map':
                    const placeLatLng = handlePlace(resInfo.typeMapResponse);
                    if (placeLatLng) map.flyTo(placeLatLng);
                    break;
            }

            setTimeout(afterSearch, 100);
        };

        /** @type {HTMLAnchorElement} */
        // @ts-ignore
        const leafletZoomIn = mapEl.getElementsByClassName('leaflet-control-zoom-in')[0];
        /** @type {HTMLAnchorElement} */
        // @ts-ignore
        const leafletZoomOut = mapEl.getElementsByClassName('leaflet-control-zoom-out')[0];
        /** @type {HTMLAnchorElement} */
        // @ts-ignore
        const leafletDescription = mapEl.getElementsByClassName('leaflet-control-attribution')[0].children[0];
        /** @type {HTMLAnchorElement} */
        // @ts-ignore
        const leafletCopyright = mapEl.getElementsByClassName('leaflet-control-attribution')[0].children[2];

        leafletZoomIn.draggable = false;
        this.#mainApp.loc.bindSimpleElAriaLabel(leafletZoomIn, 'ui.sp.map.zoom_in');
        this.#mainApp.statusLabel.addLoc(leafletZoomIn, 'ui.sp.map.zoom_in');
        leafletZoomOut.draggable = false;
        this.#mainApp.loc.bindSimpleElAriaLabel(leafletZoomOut, 'ui.sp.map.zoom_out');
        this.#mainApp.statusLabel.addLoc(leafletZoomOut, 'ui.sp.map.zoom_out');
        leafletDescription.draggable = false;
        this.#mainApp.statusLabel.addLoc(leafletDescription, 'ui.sp.map.leaflet_desc');
        leafletCopyright.draggable = false;
    }
}
