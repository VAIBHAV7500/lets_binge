import React, {useEffect,useState, useRef} from 'react';
import styles from './playlist.module.css';
import Button from '../../../common/Button';
import { FcPanorama } from "react-icons/fc";

let prevForceURL;

function PlayList({
    playlist,
    playListAction,
    height,
    isMinized,
    theatreMode,
    activeIndex,
    canPlay
}) {
    const dummy = useRef();
    const [error, setError] = useState();

    useEffect(() => {
        dummy.current.scrollIntoView();
    }, [playlist])
    
    const handleKey = (e) => {
        if (e.which === 13) {
            onAppend();
        }
    }

    const onLoad = (event,index) => {
        if (event.target.className !== styles.delete){
            playListAction(0, index);
        }
    }

    const onAppend = () => {
        const element = document.getElementById('url');
        const url = element.value;
        let errorText;
        if(!url){
            errorText = 'Add URL first';
        }else if(!canPlay(url) && prevForceURL !== url){
            errorText = 'Looks like we cannot play this URL, Press "Add to Playlist" again to Force add it!';
            prevForceURL = url;
        }else if (url) {
            playListAction(1, url).then((response) => {
                if(response){
                    element.value = '';
                }else{
                    errorText = 'This URL already exists in the playlist';
                }
            });
        }

        setError(errorText);
        setTimeout(() => {
            setError();
        }, 5000);
    }

    const deletePlaylistItem = (index) => {
        playListAction(3, '',false,index);
    }

    const getPlaylistItem = (playitem, index) => {
        const isActive = activeIndex === index;
        const className =  `${styles.bubble} ${(isActive) ? styles.active_item : ''}`;
        return (<div className= {className} key={index} onClick={(event) => {onLoad(event,index)}}>
                    {playitem.username && <div className={styles.username}>{`${(isActive ? '▶': '')} ${playitem.username}`}:</div>}
                    <div className={styles.message}>{playitem.url}</div>
                    <p className={styles.delete} onClick={() => { deletePlaylistItem(index) }}>Delete</p>
                </div>);  
    }

    return (
        <div className={styles.body} style={{height}}>
            <div className={styles.message_area}>
                {playlist && playlist.map((msg,index) => {
                    return getPlaylistItem(msg,index)
                })}
                <span ref={dummy}></span>
            </div>
            <div className={styles.input_message}>
                <input onKeyPress={handleKey} type="text" id="url" autoComplete="off" placeholder={"DROP YOUR LINK HERE"}></input>
                <Button width={true} id="playlist" onClick={onAppend}>Add to PlayList</Button>
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    )
}

export default PlayList
