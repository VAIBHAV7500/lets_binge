import React, {useEffect} from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import ReactPlayer from 'react-player'

import styles from './player.module.css';

function Player({src}) {

    const config = {
        youtube: {
            playerVars: {
                showinfo: 1,
                autoplay: 1
            }
        },
        facebook: {
            appId: '12345'
        }
    }

    
    useEffect(() => {

        return () => {
        //player.destroy();
        }
    });

    useEffect(()=>{
        console.log(src);
    },[src]);

    return (
        <div className={styles.player}>
            <ReactPlayer
                url={src}
                className={styles.react_player}
                width={'100%'}
                height={'100%'}
                config={config}
                controls={true}
            />
        </div>
    )
}

export default Player
