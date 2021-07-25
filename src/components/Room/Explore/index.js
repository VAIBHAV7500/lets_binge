import React, { useRef, useState } from 'react';
import styles from './explore.module.css';
import youtube from './youtube';

let youtubeNext = '';
const youtubeBase = 'https://www.youtube.com/watch?v=';
let prevSearchKey;

const Explore = ({onClickVideo, onClose}) => {
    const searchInputRef = useRef();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleYoutubeSearch = async (key) => {
        setLoading(true);
        const result = await youtube.search(key, youtubeNext);
        console.log(result);
        prevSearchKey = key;
        const [temp, nextToken] = youtube.getVideosData(result.data);
        if(youtubeNext === '' || youtubeNext == null){
            setData(temp);
        }else{
            setData(data.concat(temp));
        }
        youtubeNext = nextToken;
        setLoading(false);
    }
    
    const onClickSearch = async () => {
        youtubeNext = '';
        const value = searchInputRef.current.value;
        handleYoutubeSearch(value);
    }

    const onClickItem = (id, type="youtube") => {
        let url;
        if(type === "youtube"){
            url = youtubeBase + id;
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
            console.log('Searching');
            handleYoutubeSearch(prevSearchKey);
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

    return (
        <div className={`${styles.modal}`}>
            <div className={styles.search_container} >
                <input placeholder="Search from Youtube" onKeyDown={handleKey} ref={searchInputRef} className={styles.search_input}></input>
                <button className={styles.go_button} onClick={onClickSearch} >Search</button>
                <button className={styles.go_button} onClick={onClickClose} >Close</button>
            </div>
            <div className={styles.show_case} onScroll={handleScroll}>
                {data.length !== 0 && data.map((video, index) => {
                    return <div className = {
                        styles.item
                    }
                    key={index}
                    onClick={() => {onClickItem(video.id)}}
                    style = {
                        getItemStyle(video)
                    } >
                        {/* <img src={video.thumbnail} alt={video.description}></img> */}
                        <div className={styles.title}>{video.title}</div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Explore
