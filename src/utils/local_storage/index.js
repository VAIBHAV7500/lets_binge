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
        } else {
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

const setRoom = (data) => {
    const value = {
        id: data.id
    };
    const key = 'rooms';
    const rooms = get(key) || [];
    rooms.push(value);
    set(key, rooms.filter((v, i, a) => a.indexOf(v) === i));
}

const chunkify =  (items, size) => {  
    const chunks = []
    items = [].concat(...items)
  
    while (items.length) {
      chunks.push(
        items.splice(0, size)
      )
    }
    return chunks
  }

export default {
    set,
    get,
    remove,
    clearStorage,
    setRoom,
    chunkify
}
