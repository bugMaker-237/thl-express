'use strict';


let FileSystemAccess = require('tns-core-modules/file-system/file-system-access').FileSystemAccess;

// So that code that is looking for the "Storage" object will pass its check
if (!global.Storage) {
    global.Storage = function Storage() {};
}

if (!global.localStorage || module.hot) {
    let localStorageData = {};
    let localStorageTimeout = null;

    const internalSaveData = function () {
        const fsa = new FileSystemAccess();
        const fileName = fsa.getDocumentsFolderPath() + '/localStorage.db';
        try {
            fsa.writeText(fileName, JSON.stringify(localStorageData));
        } catch (err) {
            // This should never happen on normal data, but if they tried to put non JS stuff it won't serialize
            console.log('localStorage: unable to write storage, error: ', err);
        }

    };

    const saveData = function () {
        if (localStorageTimeout !== null) {
            clearTimeout(localStorageTimeout);
        }
        localStorageTimeout = setTimeout(internalSaveData, 250);
    };

    const loadData = function () {
        const fsa = new FileSystemAccess();
        const fileName = fsa.getDocumentsFolderPath() + '/localStorage.db';
        if (!fsa.fileExists(fileName)) {
            return;
        }

        let data;
        try {
            const textData = fsa.readText(fileName);
            data = JSON.parse(textData);
            localStorageData = data;
        } catch (err) {
            console.log('localStorage: error reading storage, Error: ', err);
        }
    };

    loadData();

    global.localStorage = {
        getItem(name) {
            if (localStorageData.hasOwnProperty(name)) {
                return localStorageData[name];
            }
            return null;
        },
        key(id) {
            const keys = Object.keys(localStorageData);
            if (id >= keys.length) {
                return null;
            }
            return keys[id];
        },
        setItemObject(name, value) {
            localStorageData[name] = value;
            saveData();
        },
        // Revamp this to be "String" only
        // https://github.com/NathanaelA/nativescript-localstorage/issues/17
        setItem(name, value) {
            if (value == null) {
                if (value === null) {
                    localStorageData[name] = 'null';
                } else {
                    localStorageData[name] = 'undefined';
                }
            } else {
                localStorageData[name] = value.toString();
            }
            saveData();
        },
        removeItem(name) {
            if (localStorageData[name]) {
                delete localStorageData[name];
                saveData();
            }
        },
        clear() {
            localStorageData = {};
            saveData();
        }
    };
    Object.defineProperty(global.localStorage, 'length', {
        get() {
            return (Object.keys(localStorageData).length);
        },
        enumerable: true,
        configurable: true
    });
}


if (!global.sessionStorage) {
    let sessionStorageData = {};

    global.sessionStorage = {
        getItem(name) {
            if (sessionStorageData.hasOwnProperty(name)) {
                return sessionStorageData[name];
            }
            return null;
        },
        key(id) {
            const keys = Object.keys(sessionStorageData);
            if (id >= keys.length) {
                return null;
            }
            return keys[id];
        },
        setItemObject(name, value) {
            sessionStorageData[name] = value;
        },
        setItem(name, value) {
            if (value == null) {
                if (value === null) {
                    sessionStorageData[name] = 'null';
                } else {
                    sessionStorageData[name] = 'undefined';
                }
            } else {
                sessionStorageData[name] = value.toString();
            }
        },

        removeItem(name) {
            if (sessionStorageData[name]) {
                delete sessionStorageData[name];
            }
        },
        clear() {
            sessionStorageData = {};
        }
    };
    Object.defineProperty(global.sessionStorage, 'length', {
        get() {
            return (Object.keys(sessionStorageData).length);
        },
        enumerable: true,
        configurable: true
    });
}




module.exports = global.localStorage;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        global.localStorage = undefined;
    });
}