import {reactLocalStorage} from 'reactjs-localstorage';

const set = (key, value) => {
    if (typeof value === 'object' && value !== null){
        reactLocalStorage.setObject(key, value);
    }else{
        reactLocalStorage.set(key, value);
    }
}

const get = (key) => {
    if(key){
        const value = reactLocalStorage.getObject(key);
        if (typeof value === 'object' && Object.keys(value).length !== 0) {
            return value;
        }else{
            return reactLocalStorage.get(key);
        }
    }
    return null;
}

const remove = (key) => {
    return reactLocalStorage.remove(key);
}

const clearStorage = () => {
    return reactLocalStorage.clear();
}

export default {
    set,
    get,
    remove,
    clearStorage
}