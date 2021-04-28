import React,{useEffect, useState} from 'react';
import Player from './player';
import Chat from './Chat';
import styles from './room.module.css';
import config from '../../config';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
} from "react-router-dom";
import LocalStorage from '../utils/local_storage';
import firestore from '../../config/firestore';

function Room() {

    const [src, setSrc] = useState(config.DEFAULT_SRC);
    const [ name, setName ] = useState('USER');
    let [messages, setMessages] = useState([]);
    let { id } = useParams();
    let [userId, setUserId] = useState(null);

    let members = new Map();

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
        const element = document.getElementById('link');
        const url = element.value;
        const finalSrc = checkURL(url); 
        setSrc(finalSrc);
    }

    const checkUsername = () => {
        console.log('Checking');
        const key = config.USERNAME_KEY;
        let username = LocalStorage.get(key);
        console.log(username);
        if(username){
            return username;
        }else{
            username = prompt('Enter Username');
            LocalStorage.set(key,username);
            return username;
        }
    }

    const updateMembers = async () => {
        const result = await firestore.getMembers(id);
        result.forEach((res) => {
            members.set(res.id,res.data().name);
        });
    }

    const createMember = async (username) => {
        const room = LocalStorage.get(id);
        if(room && room.member){
            userId = room.member;
            setUserId(userId);
        }else{
            userId = await firestore.createMember(id, username);
            setUserId(userId);
            const roomJson = {
                member: userId
            }
            LocalStorage.set(id, roomJson);
        }
        firestore.createEvent(id, config.EVENT.ADD, userId, '');
    }

    const addMessage = (msg) => {
        console.log(userId);
        firestore.createEvent(id,config.EVENT.MESSAGE, userId, msg);
    }

    const getUsername = (id) => {
        let username = members.get(id);
        return username === undefined ? firestore.findMember(id) : username;
    }

    const handleEvent = (event) => {
        const user = event.user;
        const username = getUsername(user);
        switch (event.type) {
            case config.EVENT.ADD:
                return {
                    message: `${username} is here!`
                };
                break;
            
            case config.EVENT.REMOVE:
                return {
                    message: `${username} left!`
                };
                break;
            case config.EVENT.MESSAGE:
                return {
                    message: event.message,
                    username: username
                }
                break;
        }
    }

    useEffect(()=>{
        const username = checkUsername();
        setName(username);
        createMember(username);
        updateMembers().then((res)=> {
            firestore.events(id).onSnapshot(querySnapshot => {
                const newMessages = []
                const changes = querySnapshot.docChanges()
                changes.forEach(change => {
                    const msg = handleEvent(change.doc.data());
                    console.log(msg.createdAt);
                    if (msg) {
                        newMessages.push(msg);
                    }
                });
                console.log(newMessages);
                console.log(messages.concat(newMessages))
                messages = messages.concat(newMessages);
                setMessages(messages);
            })
        });

        return () => {
            firestore.createEvent(id,config.EVENT.REMOVE,userId,'');
        }
    },[]);
    
    return (
        <div className={styles.room_container}>
            <div className={styles.wrapper}>
                <Player className="player" src={src} />
                <Chat className="chat" messages = {messages} addMessage = {addMessage} />
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
