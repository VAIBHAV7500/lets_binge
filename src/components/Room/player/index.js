import React, {useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import CONFIG from '../../../config';

import styles from './player.module.css';

let prevTime = 0;

function Player({
    src,
    createEvent,
    playing,
    updateRoomProgress,
    seek,
    playListAction
}, ref) {
    const player = useRef();
    const PLAYER_CONFIG = CONFIG.EVENT.PLAYER;

    
    useEffect(() => {

        return () => {
        //player.destroy();
        }
    });

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
        if(prevTime + bufferTime < currTime && prevTime != 0){
            console.log('Forward Seeking by ' + (currTime - prevTime));
            createEvent(PLAYER_CONFIG.SEEK_FORWARD.KEYWORD, (currTime - prevTime));
        }else if(currTime + bufferTime - 2 < prevTime && prevTime != 0){
            console.log('Backward Seeking by ' + (prevTime - currTime));
            createEvent(PLAYER_CONFIG.SEEK_BACKWARD.KEYWORD, (prevTime - currTime));
        }
        prevTime = currTime;
    }

    useEffect(()=>{
        if(seek){
            player.current.seekTo(seek, "fraction");
            const currTime = player.current.getCurrentTime();
            prevTime = currTime;
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

export default forwardRef(Player)
