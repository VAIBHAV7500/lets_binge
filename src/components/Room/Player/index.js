import React, {useEffect, useRef, useImperativeHandle, forwardRef, useState} from 'react';
import SvgIcon from '../../../common/SvgIcon';
import ReactPlayer from 'react-player';
import CONFIG from '../../../config';

import styles from './player.module.css';

let prevTime = 0;
let adjustmentSeek = false;

function Player({
    src,
    createEvent,
    playing,
    updateRoomProgress,
    seek,
    playListAction,
    isMinized,
    theatreMode,
    setExplore
}, ref) {
    const player = useRef();
    const PLAYER_CONFIG = CONFIG.EVENT.PLAYER;
    const [error, setError] = useState('Some Error');

    useImperativeHandle(ref, () => ({
        seek: (type, duration) => {
            let seekTime = 0;
            const currTime = player.current.getCurrentTime();
            const totalDuration = player.current.getDuration();
            const seekDuration = parseInt(duration);
            if(type === 'forward'){
                seekTime = currTime + seekDuration;
                if(seekTime > totalDuration){
                    seekTime = totalDuration;
                }
            }else{
                seekTime = currTime - seekDuration;
                if(seekTime < 0){
                    seekTime = 0;
                }
            }
            prevTime = seekTime;
            player?.current?.seekTo(seekTime, "seconds");
        },

        canPlay: (url) => {
            return ReactPlayer.canPlay(url);
        },

        getProgress: () => {
            const currTime = player?.current?.getCurrentTime();
            const totalDuration = player?.current?.getDuration();
            if(currTime && totalDuration){
                return currTime/totalDuration;
            }else{
                return 0;
            }
        }
    }));

    const onPlay = () => {
        if(playing === false){
            createEvent(PLAYER_CONFIG.PLAY.KEYWORD);
        }
    }

    const onPause = () => {
        if(playing === true){
            createEvent(PLAYER_CONFIG.PAUSE.KEYWORD);
        }
    }

    const onBuffer = () => {
        console.log('Bufferringgg!!');
    }

    const onSeek = () => {
        console.log('Seekingg');
    }

    const onEnded = () => {
        prevTime = 0;
        playListAction(2);
    }

    const updateProgress = (data) => {
        updateRoomProgress(data.played);
        const currTime = player.current.getCurrentTime();
        const bufferTime = CONFIG.BUFFER_TIME;
        if (!adjustmentSeek){
            if (prevTime + bufferTime < currTime && prevTime !== 0) {
                console.log('Forward Seeking by ' + (currTime - prevTime));
                createEvent(PLAYER_CONFIG.SEEK_FORWARD.KEYWORD, (currTime - prevTime));
            } else if (currTime + bufferTime - 2 < prevTime && prevTime !== 0) {
                console.log('Backward Seeking by ' + (prevTime - currTime));
                createEvent(PLAYER_CONFIG.SEEK_BACKWARD.KEYWORD, (prevTime - currTime));
            }
        }else{
            adjustmentSeek = false;
        }
        prevTime = currTime;
    }

    useEffect(()=>{
        if(seek){
            adjustmentSeek = true;
            if(player?.current){
                player.current.seekTo(seek, "fraction");
                const totalDuration = player?.current?.getDuration();
                if (totalDuration) {
                    const timeInSec = seek * totalDuration;
                    prevTime = timeInSec;
                }
            }
        }
    },[seek])

    const config = {
        youtube: {
            playerVars: {
                showinfo: 0,
                autoplay: 1
            },
            events: {
                'onStateChange': onEnded
            }
        },
        facebook: {
            appId: CONFIG.FACEBOOK.APP_ID
        }
    }

    const getPlayer = () => {
        return (<ReactPlayer
                url={src}
                ref={player}
                playing = {playing}
                className={styles.react_player}
                loop={false}
                width={'100%'}
                height={'100%'}
                config={config}
                controls={true}
                onPause = {onPause}
                onBuffer = {onBuffer}
                onSeek = {onSeek}
                onPlay = {onPlay}
                onEnded = {onEnded}
                onProgress = {updateProgress}
            />);
    }

    const addToPlaylist = () => {
        const el = document.getElementById('player_url');
        if(el){
            const url = el.value;
            playListAction(1, url).then((response) => {
                console.log(response);
            });
        }
    }

    const getBlankTemplate = () => {
        return <div>
            <div className={styles.playlist}>
                <input type="text" id="player_url" placeholder='Paste your URL here' className={styles.url_input}></input>
                <button className={styles.playlist_button} onClick={addToPlaylist}>Play</button>
                <button className={styles.playlist_button} onClick={() => {setExplore(true)}}>Explore</button>
            </div>
            <div className={styles.svg_placeholder}>
                <SvgIcon 
                    src= "loading_1.svg"
                    width="50%"
                    height="50%"
                />
            </div>
        </div>
    }

    return (
        <div className={styles.player} style={{
            width: (isMinized ? '100%' : '70%'),
            boxShadow: (isMinized ? 'none' : undefined)
        }}>
            {src ? (getPlayer()) : getBlankTemplate()}
        </div>
    )
}

export default forwardRef(Player)