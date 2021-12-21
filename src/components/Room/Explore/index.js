import React, { useRef, useState, useEffect } from 'react';
import styles from './explore.module.css';
import youtube from './youtube';
import twitch from './twitch';
import vimeo from './vimeo';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let youtubeNext = '';
const youtubeBase = 'https://www.youtube.com/watch?v=';
const twitchBase = 'https://www.twitch.tv/';
const vimeoBase = 'https://www.vimeo.com';
const sources = ['All', 'Twitch', 'Youtube', 'Vimeo'];
const animals = ['🐶', '🐵', '🐴', '🦄', '🦌', '🐷', '🐘', '🐭', '🐁', '🐹', '🦒', '🐻', '🐻‍❄️', '🐼', '🐤', '🐧', '🕊️', '🦩'];
let prevSearchKey;

const Explore = ({onClickVideo, onClose, isAllowedUpdate}) => {
    const searchInputRef = useRef();
    const [data, setData] = useState([]);
    const [youtubeData, setYTData] = useState([]);
    const [twitchData, setTwitchData] = useState([]);
    const [vimeoData, setVimeoData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(0);


    const handleYoutubeSearch = async (key) => {
        const result = await youtube.search(key, youtubeNext).catch((err) => {}) || {data: {items: []}};
        prevSearchKey = key;
        const [temp, nextToken] = youtube.getVideosData(result.data);
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

    const handleVimeoSearch = async (key) => {
        const result = await vimeo.search(key).catch((err) => {}) || {data: []};
        const temp = vimeo.getVideosData(result);
        setVimeoData(temp);
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
        const youtubeData = dataArray[0] || [];
        const twitchData = dataArray[1] || [];
        const vimeoData = dataArray[2] || [];
        const shuffledData = shuffle(youtubeData.concat(twitchData).concat(vimeoData));
        setAllData(shuffledData);
        setTwitchData(twitchData);
        setVimeoData(vimeoData);
        setYTData(youtubeData);
        setData(shuffledData);
        setActive(0);
    }
    
    const onClickSearch = async () => {
        youtubeNext = '';
        const value = searchInputRef.current.value;
        handleYoutubeSearch(value);
        const searches = [];
        searches.push(new Promise((res,rej) => {
            handleYoutubeSearch(value).then((result) => {res(result)}).catch((err) => {rej([])});
        }));
        searches.push(new Promise((res,rej) => {
            handleTwitchSearch(value).then((result) => {res(result)}).catch((err) => {rej(err)});
        }));
        searches.push(new Promise((res,rej) => {
            handleVimeoSearch(value).then((result) => {res(result)}).catch((err) => {rej(err)});
        }));
        setLoading(true);
        const results = await Promise.all(searches);
        setLoading(false);
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
        }else if(type === 'vimeo'){
            url = video.url;
        }
        const response = onClickVideo(url);
        if(isAllowedUpdate('playlist_allow')){
            toast.success(`${animals[Math.floor(Math.random() * animals.length)]} Added to the Playlist!`, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
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

    const onClickNavItem = (index) => {
        setActive(index);
        if(index === 0){
            setData(allData);
        }else if(index === 1){
            setData(twitchData);
        }else if(index === 2){
            setData(youtubeData);
        }else if(index === 3){
            setData(vimeoData);
        }
    }

    useEffect(() => {
        searchInputRef.current.focus();
    }, []);

    return (
        <div className={`${styles.modal}`}>
            <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            transition={Flip}
            pauseOnHover
            />
            <div className={styles.search_container} >
                <input placeholder="Type your Keyword here" onKeyDown={handleKey} ref={searchInputRef} className={styles.search_input}></input>
                <button className={styles.go_button} onClick={onClickSearch} >Search</button>
                <button className={styles.go_button} onClick={onClickClose} >Close</button>
            </div>
            {loading === true && <div className={styles.loading}>Fetching Results...</div>}
            {allData && allData.length !== 0 && <div className={styles.sources_nav}>
                {sources.map((source, index) => {return <div key={index} onClick={() => {onClickNavItem(index)}} className={`${styles.source_nav_item} ${index === active ? styles.source_nav_active : ''}`}>{source}</div>})}
            </div>}
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
                        <div className={`${styles.source} ${video.type === 'youtube' ? styles.source_youtube : (video.type === 'twitch' ? styles.source_twitch : styles.source_vimeo)}`}>{video.type}</div>
                    </div>
                })}
            </div>}
        </div>
    )
}

export default Explore
