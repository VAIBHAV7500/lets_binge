import React, { useRef, useState, useEffect } from 'react';
import styles from './explore.module.css';
import youtube from './youtube';
import twitch from './twitch';

let youtubeNext = '';
const youtubeBase = 'https://www.youtube.com/watch?v=';
const twitchBase = 'https://www.twitch.tv/';
const sources = ['All', 'Twitch', 'Youtube'];
let prevSearchKey;

const Explore = ({onClickVideo, onClose}) => {
    const searchInputRef = useRef();
    const [data, setData] = useState([]);
    const [youtubeData, setYTData] = useState([]);
    const [twitchData, setTwitchData] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleYoutubeSearch = async (key) => {
        setLoading(true);
        const result = await youtube.search(key, youtubeNext).catch((err) => {}) || {data: {items: []}};
        console.log(result);
        prevSearchKey = key;
        const [temp, nextToken] = youtube.getVideosData(result.data);
        setLoading(false);
        if(youtubeNext === '' || youtubeNext == null){
            setYTData(temp);
            youtubeNext = nextToken;
            return temp;
        }else{
            setYTData(youtubeData.concat(temp));
            youtubeNext = nextToken;
            return youtubeData.concat(temp);
        }
    }

    const handleTwitchSearch = async (key) => {
        const result = await twitch.search(key).catch((err) => {}) || [];
        const temp = twitch.getVideosData(result);
        setTwitchData(temp);
        return temp;
    }

    const shuffle =(array) => {
        let currentIndex = array.length,  randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const mergeData = (dataArray) => {
        const youtubeData = dataArray[0];
        const twitchData = dataArray[1];
        if ((youtubeData == null || youtubeData.length === 0) && (twitchData == null || twitchData.length === 0)){
            setData([]);
        }
        else if(youtubeData == null || youtubeData.length === 0){
            setData(twitchData);
        }
        else if (twitchData == null || twitchData.length === 0){
            setData(youtubeData);
        }else{
            setData(shuffle(youtubeData.concat(twitchData)));
        }
    }
    
    const onClickSearch = async () => {
        youtubeNext = '';
        const value = searchInputRef.current.value;
        console.log('In Search');
        handleYoutubeSearch(value);
        const searches = [];
        searches.push(new Promise((res,rej) => {
            handleYoutubeSearch(value).then((result) => {res(result)}).catch((err) => {rej([])});
        }));
        searches.push(new Promise((res,rej) => {
            handleTwitchSearch(value).then((result) => {res(result)}).catch((err) => {rej(err)});
        }));
        const results = await Promise.all(searches);
        mergeData(results);
    }

    const onClickItem = (video) => {
        let url;
        const type = video.type;
        if(type === "youtube"){
            const id = video.id;
            url = youtubeBase + id;
        }else if(type === 'twitch'){
            const name = video.name;
            url = twitchBase + name;
        }
        console.log(url);
        onClickVideo(url);
    }

    const handleKey = (event) => {
        if (event.which === 13) {
            onClickSearch();
        }
    }

    const onClickClose = () => {
        onClose();
    }

    const handleScroll = (event) => {
        const target = event.target;
        console.log(target.scrollHeight - target.scrollTop);
        console.log(target.clientHeight);
        if( (target.scrollHeight - target.scrollTop <= (target.clientHeight + 300)) && target.clientHeight !== 0 && loading === false){
            // disabling it to reduce the number of calls and sticking to some results
            //handleYoutubeSearch(prevSearchKey);
        }
    }

    const getItemStyle = (video) => {
        const colors = ['#FF0000', '#FFC000', '#FFFC00', '#00FF00', '#00FFFF', '#FF00FF'];
        const styleJson = {
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            backgroundImage: `url(${video.thumbnail})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }
        return styleJson;
    }

    useEffect(() => {
        searchInputRef.current.focus();
    }, [])

    return (
        <div className={`${styles.modal}`}>
            <div className={styles.search_container} >
                <input placeholder="Type your Keyword here" onKeyDown={handleKey} ref={searchInputRef} className={styles.search_input}></input>
                <button className={styles.go_button} onClick={onClickSearch} >Search</button>
                <button className={styles.go_button} onClick={onClickClose} >Close</button>
            </div>
            {/* <div className={styles.sources_nav}>
                {sources.map((source) => {return <div className={styles.source_nav_item}>{source}</div>})}
            </div> */}
            {data && data.length !== 0 && <div className={styles.show_case} onScroll={handleScroll}>
                {data.length !== 0 && data.map((video, index) => {
                    return <div className = {
                        styles.item
                    }
                    key={index}
                    onClick={() => {onClickItem(video)}}
                    style = {
                        getItemStyle(video)
                    } >
                        {/* <img src={video.thumbnail} alt={video.description}></img> */}
                        <div className={styles.title}>{video.title}</div>
                        <div className={`${styles.source} ${video.type === 'youtube' ? styles.source_youtube : styles.source_twitch}`}>{video.type}</div>
                    </div>
                })}
            </div>}
        </div>
    )
}

export default Explore