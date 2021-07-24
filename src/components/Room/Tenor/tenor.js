import axios from 'axios';
import config from '../../../config';

const TENOR = config.TENOR;

const makeCall = async (url) => {
    return await axios.get(url);
}

const search = (key, next = null, limit = 20, ) => {
    let endpoint = TENOR.BASE_URL + `search?q=${key}&key=${TENOR.KEY}&limit=${limit}`;
    if(next != null){
        endpoint += `&pos=${next}`;
    }
    return makeCall(endpoint);
}

const trending = (next = null, limit = 20) => {
    let endpoint = TENOR.BASE_URL + `trending?limit=${limit}&key=${TENOR.KEY}`;
    if(next != null && next !== 0){
        endpoint += `&pos=${next}`;
    }
    return makeCall(endpoint);
}


export default {
    search,
    trending
}