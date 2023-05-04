import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocFromServer,
    getDocsFromServer,
    addDoc,
    updateDoc,
} from 'firebase/firestore';
import store from 'store2';
import { MainApp } from '../main';

export class FirebaseInterface {
    #mainApp;
    #firebase = {};

    loggedIn = false;
    username = '';

    /**
     * @param {MainApp} mainApp
     * @param {import('../types').FirebaseConfig} firebaseConfig
     */
    constructor(mainApp, firebaseConfig) {
        this.#mainApp = mainApp;

        this.#firebase.app = initializeApp(firebaseConfig);
        this.#firebase.database = getFirestore(this.#firebase.app);
        this.#firebase.usersCollection = collection(this.#firebase.database, 'users');

        const storedUser = store.get('username');
        const storedPass = store.get('password');
        if (storedUser && storedPass) {
            this.logIn(storedUser, storedPass).then((result) => {
                if (result.success) {
                    console.info('FirebaseInterface | Auto-login successful');
                } else {
                    console.warn('FirebaseInterface | Auto-login failed, removing auto-login data...');
                }
            });
        }

        this.#mainApp.events.target.addEventListener('settingschanged', () => this.updateRemote());
        this.#mainApp.events.target.addEventListener('addedtofavorites', () => this.updateRemote());
        this.#mainApp.events.target.addEventListener('addedtohistory', () => this.updateRemote());
    }

    /**
     * @param {string} pUsername
     * @param {string} pPassword
     */
    async logIn(pUsername, pPassword) {
        if (pUsername && pPassword) {
            pUsername = pUsername.trim();
            pPassword = pPassword.trim();

            const q = query(this.#firebase.usersCollection, where('username', '==', pUsername));
            const querySnapshot = await getDocsFromServer(q);
            if (querySnapshot.empty) {
                return {
                    code: 'user_or_pass_incorrect',
                    success: false,
                };
            } else {
                let toReturn = '';
                let success = false;
                querySnapshot.forEach((doc) => {
                    if (doc.data()['password'] === pPassword) {
                        this.loggedIn = true;
                        this.username = pUsername;

                        this.#firebase.docRef = doc.ref;
                        this.#firebase.doc = doc;

                        store.set('username', pUsername);
                        store.set('password', pPassword);

                        this.sync(true);

                        this.#mainApp.events.quick.firebase.loggedIn();
                        toReturn = 'login_success';
                        success = true;

                        // ako se nije već promijenila
                        if (location.hash === '#/account/login') {
                            if (this.#mainApp.firebaseInterface.loggedIn) location.hash = '#/account';
                        }
                    } else {
                        toReturn = 'user_or_pass_incorrect';
                    }
                });
                return {
                    code: toReturn,
                    success: success,
                };
            }
        } else {
            return {
                code: 'user_or_pass_empty',
                success: false,
            };
        }
    }

    logOut() {
        if (this.loggedIn) {
            this.loggedIn = false;
            store.remove('username');
            store.remove('password');
            this.#mainApp.events.quick.firebase.loggedOut();
        }
    }

    /**
     * @param {string} pUsername
     * @param {string} pPassword
     */
    async register(pUsername, pPassword) {
        if (pUsername && pPassword) {
            pUsername = pUsername.trim();
            pPassword = pPassword.trim();

            const q = query(this.#firebase.usersCollection, where('username', '==', pUsername));
            const querySnapshot = await getDocsFromServer(q);
            if (querySnapshot.empty) {
                try {
                    this.#firebase.storageDocRef = await addDoc(this.#firebase.usersCollection, {
                        username: pUsername,
                        password: pPassword,
                    });

                    this.logIn(pUsername, pPassword);

                    return {
                        code: 'register_success',
                        success: true,
                    };
                } catch (e) {
                    console.warn(e);
                    return {
                        code: 'register_failure',
                        data: e,
                        success: false,
                    };
                }
            } else {
                return {
                    code: 'username_unavailable',
                    success: false,
                };
            }
        } else {
            return {
                code: 'username_or_pass_empty',
                success: false,
            };
        }
    }

    /** @param {boolean} [noDocUpdate] */
    async sync(noDocUpdate) {
        console.info('FirebaseInterface | Syncing...');
        await this.updateLocal(noDocUpdate ? true : false);
        await this.updateRemote();
        console.info('FirebaseInterface | Sync finished');
    }

    /** @param {boolean} [noDocUpdate] */
    async updateLocal(noDocUpdate) {
        // overwritamo lokalne postavke s remote postavkama pa sve šaljemo nazad
        if (this.loggedIn) {
            console.info('FirebaseInterface | Updating local...');

            if (!noDocUpdate) {
                this.#firebase.doc = await getDocFromServer(this.#firebase.docRef);
            }
            store.namespace('user').setAll(this.#firebase.doc.data().user);

            this.#mainApp.events.quick.settings.allChanged();
            this.#mainApp.events.quick.refreshHistory();

            console.info('FirebaseInterface | Updated local.');
        } else {
            console.info(
                'FirebaseInterface | Sync | Not updating local data with remote data (RtL); user is not logged in'
            );
        }
    }

    async updateRemote() {
        if (this.loggedIn) {
            console.info('FirebaseInterface | Updating remote...');

            let userStuff = store.namespace('user').getAll();
            // * ovo nije najbolje rješenje jer onda možemo promijeniti i lozinku
            await updateDoc(this.#firebase.docRef, { user: userStuff });

            console.info('FirebaseInterface | Updated remote.');
        } else {
            console.info(
                'FirebaseInterface | Sync | Not updating remote data with local data (LtR); user is not logged in'
            );
        }
    }
}
