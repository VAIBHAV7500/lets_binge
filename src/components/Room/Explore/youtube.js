import config from '../../../config';
import axios from 'axios';

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/';


const getVideosData = (dataArr) => {
    const data = [];
    const videos = dataArr.items;
    videos.forEach((video) => {
        if(video.id.kind === "youtube#video"){
            const id = video.id.videoId;
            const snippet = video.snippet;
            const title = snippet.title;
            const label = snippet.description;
            const thumbnail = snippet.thumbnails.medium.url;
            data.push({
                id,
                title,
                label,
                thumbnail,
                type: 'youtube'
            });
        }
    });
    return [data,dataArr.nextPageToken];
}


const search = (term, next = '', limit = 30) => {
    let endpoint = BASE_URL + `search?part=snippet&key=${config.FIREBASE.API_KEY}&maxResults=${limit}`;
    if(next !== '' && next != null){
        endpoint += `&pageToken=${next}`;
    }
    endpoint += `&q=${term}`;
    return axios.get(endpoint);
}

export default {
    search,
    getVideosData
}