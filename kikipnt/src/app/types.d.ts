import type { Placement } from '@floating-ui/dom';

// localizationMgr
export type LanguageValues =
    | 'ui.generic.log_in'
    | 'ui.generic.register'
    | 'ui.generic.log_out'
    | 'ui.generic.username'
    | 'ui.generic.password'
    | 'ui.generic.search'
    | 'ui.generic.open_map'
    | 'ui.generic.nothing_here_yet'
    | 'ui.searchbox.label'
    | 'ui.searchbox.dropdown.msg'
    | 'ui.sp.account.title'
    | 'ui.sp.account.logged_in_as'
    | 'ui.sp.account.benefits'
    | 'ui.sp.accountlogin.title'
    | 'ui.sp.accountlogin.failure'
    | 'ui.sp.about.title'
    | 'ui.sp.about.hint'
    | 'ui.sp.about.version'
    | 'ui.sp.about.description'
    | 'ui.sp.about.learn_more'
    | 'ui.sp.about.tip'
    | 'ui.sp.home.title'
    | 'ui.sp.home.greeting'
    | 'ui.sp.home.learn_more'
    | 'ui.sp.map.title'
    | 'ui.sp.map.marker.add_favorite'
    | 'ui.sp.map.marker.focus_on_prev'
    | 'ui.sp.map.marker.focus_on'
    | 'ui.sp.map.marker.focus_on_next'
    | 'ui.sp.map.marker.search_zoom'
    | 'ui.sp.map.marker.search_here'
    | 'ui.sp.map.marker.remove_marker'
    | 'ui.sp.map.marker.type'
    | 'ui.sp.map.marker.coords'
    | 'ui.sp.map.zoom_in'
    | 'ui.sp.map.zoom_out'
    | 'ui.sp.map.leaflet_desc'
    | 'ui.sp.map.open_favorites'
    | 'ui.sp.map.open_history'
    | 'ui.sp.history.title'
    | 'ui.sp.history.text_notice'
    | 'ui.sp.history.erase_all'
    | 'ui.sp.history.erase_all.confirm'
    | 'ui.sp.settings.title'
    | 'ui.sp.settings.theme'
    | 'ui.sp.settings.force_sync'
    | 'ui.sp.settings.erase_all_data'
    | 'ui.sp.settings.erase_all_data_confirm'
    | 'ui.sp.settings.themes.light'
    | 'ui.sp.settings.themes.dark'
    | 'ui.sp.settings.themes.auto'
    | 'ui.sp.settings.themes.dark_tiles'
    | 'ui.sp.settings.themes.blur_enabled'
    | 'ui.sp.settings.language'
    | 'ui.sp.settingsdev.title'
    | 'ui.sp.easteregg.title'
    | 'ui.sp.easteregg.status'
    | 'ui.generic.expand_collapse';

export interface LanguageObject {
    [T in LanguageValues]: string;
}

export interface LangBoundElement {
    element: HTMLElement;
    locValue: LanguageValues;
    useAriaLabel?: boolean;
    useTitle?: boolean;
}

// subpageCollection
export type SubpageId = 'about' | 'account' | 'accountlogin' | 'home' | 'map' | 'settings' | 'easteregg' | 'history';

export type SubpageLocation =
    | '#/about'
    | '#/about/easteregg'
    | '#/account'
    | '#/account/login'
    | '#/'
    | '#/map'
    | '#/map/history'
    | '#/settings';

// quickButton
export interface QuickButtonStyle {
    readonly root?: string[];
    readonly content?: string[];
    readonly icon?: string[];
    readonly text?: string[];
    readonly rightIcon?: string[];
}

export interface QuickButtonOptions {
    readonly text?: string;
    readonly locValue?: LanguageValues;
    readonly link?: string;
    readonly icon?: string;
    readonly rightIcon?: string;
    readonly styles?: QuickButtonStyle[];
    readonly bindToStatusLabel?: boolean;
    readonly statusLabelClearOnClick?: boolean;
    readonly clickEvent?: (event?: Event) => any;
}

export interface QuickButtonElements {
    readonly root: HTMLAnchorElement | HTMLButtonElement;
    readonly content: HTMLDivElement;
    readonly icon: HTMLSpanElement;
    readonly text: HTMLSpanElement;
    readonly rightIcon: HTMLSpanElement;
}

// quickInput
export interface QuickInputOptions {
    readonly phText?: string;
    readonly phLocValue?: LanguageValues;
    readonly icon: string;
}

// storage
export interface SettingsObject {
    language: 'en' | 'hr';
    theme: 'light' | 'dark' | 'auto';
    blur_enabled: boolean;
    dark_tiles: boolean;
}

export type SettingsKeys = keyof SettingsObject;

export type StorageKeys = SettingsKeys | 'history' | 'favorites';

// textBox
export interface TextBoxOptions {
    readonly icon?: string;
    readonly phText?: string;
    readonly phLocValue?: LanguageValues;
    readonly defValue?: string;
}

export interface TextBoxElements {
    readonly form: HTMLFormElement;
    readonly mainContainer: HTMLDivElement;
    readonly input: HTMLInputElement;
    readonly iconContainer: HTMLDivElement;
    readonly icon: HTMLSpanElement;
}

// firebaseInterface
export interface FirebaseConfig {
    readonly apiKey: string;
    readonly authDomain: string;
    readonly projectId: string;
    readonly storageBucket: string;
    readonly messagingSenderId: string;
    readonly appId: string;
}

// dropdownNew
export interface DropdownNewItem extends QuickButtonOptions {
    type?: string;
}
export interface DropdownNewOptions {
    title?: {
        locValue?: LanguageValues;
        text?: string;
    };
    initialItems?: DropdownNewItem[];
    extraClasses?: string[];
    triggerType?: 'none' | 'click';
    placement?: Placement;
    disableAutoHide?: boolean;
    fitSize?: boolean;
}

// ...
export interface FavPlaceData {
    id: string;
    name: string;
    shortName: string;
}
