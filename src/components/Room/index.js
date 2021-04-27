import React,{useEffect, useState} from 'react';
import Player from './player';
import Chat from './Chat';
import styles from './room.module.css';
import config from '../../config';

function Room() {

    const [src, setSrc] = useState(config.DEFAULT_SRC);

    const checkDomain = (url) => {
        let matched_domain = '';
        for (let i = 0; i < config.ALLOWED_DOMAINS.length; i++) {
            const domain = config.ALLOWED_DOMAINS[i];
            if (url.includes(domain)) {
                matched_domain = domain;
                break;
            }
        }

        if (matched_domain === '') {
            return -1;
        }
        let final_domain = matched_domain;
        if (config.CONVERT_DOMAINS[matched_domain]) {
            final_domain = config.CONVERT_DOMAINS[matched_domain];
        }
        return [matched_domain, final_domain];
    }

    const checkURL = (url) => {
        url = url.trim();
        const result = checkDomain(url);
        if (Array.isArray(result)) {
            return url.replace(result[0], result[1]);
        } else {
            return url;
        }
    }   

    const loadMedia = () => {
        console.log('clicking');
        const element = document.getElementById('link');
        const url = element.value;
        const finalSrc = checkURL(url);
        setSrc(finalSrc);
    }
    
    return (
        <div className={styles.room_container}>
            <div className={styles.wrapper}>
                <Player className="player" src={src} />
                <Chat className="chat" />
            </div>
            <div className={styles.details}>
                <input type="text" id='link' placeholder=" DROP YOUR LINK HERE"/>
                <button onClick={loadMedia}>LOAD</button>
            </div>
            <div className={styles.wave}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#641ba8cc" fillP="1" d="M0,128L24,133.3C48,139,96,149,144,144C192,139,240,117,288,128C336,139,384,181,432,186.7C480,192,528,160,576,170.7C624,181,672,235,720,256C768,277,816,267,864,272C912,277,960,299,1008,266.7C1056,235,1104,149,1152,112C1200,75,1248,85,1296,101.3C1344,117,1392,139,1416,149.3L1440,160L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path></svg>
            </div>  
        </div>
    )
}

export default Room
