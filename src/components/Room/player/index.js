import React, {useEffect, useRef} from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import CONFIG from '../../../config';

import styles from './player.module.css';

function Player({
    src,
    createEvent,
    playing,
    updateRoomProgress,
    seek,
    playListAction
}) {
    const player = useRef();
    const PLAYER_CONFIG = CONFIG.EVENT.PLAYER;

    
    useEffect(() => {

        return () => {
        //player.destroy();
        }
    });

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
        console.log('Ended!!!');
        playListAction(2);
    }

    const updateProgress = (data) => {
        updateRoomProgress(data.played);
    }

    useEffect(()=>{
        if(seek){
            player.current.seekTo(seek, "fraction");
        }
    },[seek])

    const config = {
        youtube: {
            playerVars: {
                showinfo: 0,
                autoplay: 0
            },
            events: {
                'onStateChange': onEnded
            }
        },
        facebook: {
            appId: '12345'
        }
    }

    return (
        <div className={styles.player}>
            <ReactPlayer
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
            />
        </div>
    )
}

export default Player
