async function get(key) {
    let get;
    if(typeof browser !== 'undefined' && browser.storage){
        get = browser.storage.local.get;
    } else {
        get = function(key) {
            return new Promise(function(resolve, reject) {
                const data = localStorage.getItem(key);
                resolve(data)
            });
        }
    }

    try {
        let data = await get(key);

        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        return undefined;
    }
}

async function set(key, data){
    let set;
    if(typeof browser !== 'undefined' && browser.storage){
        set = browser.storage.local.set;
    } else {
        set = function(key, data) {
            return new Promise(function(resolve, reject) {
                resolve(localStorage.setItem(key, data))
            });
        }
    }

    try {
        set(key, JSON.stringify(data));
    } catch(e) {
        return undefined;
    }
}

export default {
    set, get
}