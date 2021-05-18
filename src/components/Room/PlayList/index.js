import React, {useEffect,useState, useRef} from 'react';
import styles from './playlist.module.css';
import Button from '../../../common/Button';

function PlayList({
    playlist,
    playListAction,
    height,
    isMinized,
    theatreMode
}) {
    let room;
    const dummy = useRef();

    useEffect(() => {
        dummy.current.scrollIntoView();
    }, [playlist])
    
    const handleKey = (e) => {
        if (e.which === 13) {
            onAppend();
        }
    }

    const onLoad = () => {
        const element = document.getElementById('url');
        const url = element.value;
        if(url){
           playListAction(0,url,true);
           element.value = '';
        }
    }

    const onAppend = () => {
        const element = document.getElementById('url');
        const url = element.value;
        if (url) {
            playListAction(1, url);
            element.value = '';
        }
    }

    const deletePlaylistItem = (index) => {
        playListAction(3, '',false,index);
    }

    return (
        <div className={styles.body} style={{height}}>
            <div className={styles.message_area}>
                {playlist && playlist.map((msg,index) => {
                    return <div className={styles.bubble} key={index}>
                        {msg.username && <div className={styles.username}>{msg.username}:</div>}
                        <div className={styles.message}>{msg.url}</div>
                        <p className={styles.delete} onClick={() => { deletePlaylistItem(index) }}>Delete</p>
                    </div>
                })}
                <span ref={dummy}></span>
            </div>
            <div className={styles.input_message}>
                <input onKeyPress={handleKey} type="text" id="url" autoComplete="off" placeholder={"DROP YOUR LINK HERE"}></input>
                <Button width={true} id="playlist" onClick={onAppend}>Add to PlayList</Button>
            </div>
        </div>
    )
}

export default PlayList
