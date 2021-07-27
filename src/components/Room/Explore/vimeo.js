import axios from 'axios';
import config from '../../../config';

const secsToTime = (secs) => {
    return new Date(secs * 1000).toISOString().substr(11, 8);
}

const getVideosData = (metadata) => {
    const data = [];
    const videos = metadata.data;
    videos.forEach((video) => {
        let thumbnail;
        video.pictures.sizes.forEach((size) => {
            if(thumbnail){return;}
            if(size.height >= 360){
                thumbnail = size.link;
            }
        });
        data.push({
            url: video.link,
            title: video.name,
            length: secsToTime(video.duration),
            thumbnail,
            type: 'vimeo'
        })
    });
    return data;
}

const search = async(key) => {
    const endpoint = `https://api.vimeo.com/videos?query=${key}`;
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${config.VIMEO.ACCESS_TOKEN}`
    }
    const response = await axios.get(endpoint, { headers });
    return response.data;
}

export default {
    search,
    getVideosData
}