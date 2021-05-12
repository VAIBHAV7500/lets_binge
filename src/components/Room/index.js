import React,{useEffect, useState, useRef} from 'react';
import Player from './player';
import Chat from './Chat';
import PlayList from './PlayList';
import Members from './Members';
import styles from './room.module.css';
import config from '../../config';
import {
    useLocation,
    useParams
} from "react-router-dom";
import LocalStorage from '../utils/local_storage';
import firestore from '../../config/firestore';

let members = new Map();
let prevMsg = 0;

function Room() {
    const location = useLocation();
    const ref = useRef();
    const [src, setSrc] = useState(config.DEFAULT_SRC);
    const [ name , setName ] = useState('USER');
    const [active, setActive] = useState(0);
    const [ playing, setPlaying ] = useState(false);
    const [seek, setSeek] = useState(0);
    let [messages, setMessages] = useState([]);
    let [playlist, setPlaylist] = useState([]);
    let [memberlist, setMember] = useState([]);
    let [msgCounter, setMsgCounter] = useState(0);
    let isHost = false;
    let [id, setId] = useState(null);
    let [userId, setUserId] = useState(null);

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

    const getTimeDiff = (time) => {
        const currTime = new Date().getTime();
        return (currTime - time)/1000; // returning seconds
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

    const loadMedia = (url, force = false, event = true) => {
        const finalSrc = checkURL(url); 
        setSrc(finalSrc);
        if(event){
            firestore.createEvent(id, config.EVENT.LOAD.KEYWORD, userId, finalSrc);
        }
        if(force){
            if(playlist.length !== 0){
                playlist.shift();
            }
            playlist.unshift({
                url,
                username: checkUsername(),
                userId
            });
            setPlaylist([...playlist]);
        }
    }

    const appendToPlaylist = (url) => {
        const finalSrc = checkURL(url);
        if(finalSrc){
            playlist.push({
                url,
                username: checkUsername(),
                userId
            });
            if(playlist.length === 1 && !src){
                loadMedia(url);
            }
            setPlaylist([...playlist]);
        }
    }

    const mediaEnd = (event = true) => {
        if(playlist.length > 0){
            if(playlist[0].url === src){
                playlist.shift();
            }
            if(playlist.length > 0){
                const playnode = playlist[0];
                loadMedia(playnode.url,false,event);
            }else{
                setSrc(undefined);
                updateRoomProgress(1);
            }
        }
        setPlaylist([...playlist]);
    }

    const deletePlaylistItem = (index) => {
        if(playlist[index].url === src){
            mediaEnd();
        }
        playlist = playlist.filter((_, i) => i !== index);
        setPlaylist([...playlist]);
    }

    const playListAction = (type,url='',force = false, index = 0) => {
        switch(type) {
            case 0:
                loadMedia(url,force);
                break;
            case 1:
                appendToPlaylist(url);
                break;
            case 2:
                mediaEnd();
                break;
            case 3:
                deletePlaylistItem(index);
                break;
        }
        firestore.updatePlaylist(playlist, id).then(() => {
            if([1,3].includes(type)){
                createEvent(config.EVENT.PLAYLIST.KEYWORD);
            }
        });
    }

    const checkUsername = () => {
        const key = config.USERNAME_KEY;
        let username = LocalStorage.get(key);
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
            members.set(res.id,res.data());
            memberlist.push({
                id: res.id,
                name: res.data().name,
                isHost: res.data().isHost
            });
        });
        memberlist = [...new Set(memberlist)];
        setMember([...memberlist]);
    }

    const createMember = async (username) => {
        const room = LocalStorage.get(id);
        if(room && room.member){
            userId = room.member;
            setUserId(userId);
        }else{
            const isOwner = members.size === 0 ? true : false;
            userId = await firestore.createMember(id, username, isOwner);
            setUserId(userId);
            const roomJson = {
                member: userId
            }
            LocalStorage.set(id, roomJson);
            members.set(userId, {
                name: username,
                isHost: isOwner
            });
            memberlist.push({
                id: userId,
                name,
                isHost: isOwner
            });
            memberlist = [...new Set(memberlist)];
            setMember([...memberlist]);
        }
        firestore.createEvent(id, config.EVENT.ADD.KEYWORD, userId, '');
    }

    const getUsername = async (user) => {
        let username = members.get(user)?.name;
        return username === undefined ? await firestore.findMember(user,id) : username;
    }

    const checkRoomDetails = async () => {
        const res = await firestore.getARoom(id);
        if(res){
            const data = res.data();
            if(data.url){
               setSrc(data.url);
            }
            if(data.progress){
                setSeek(data.progress);
            }
            if(data.playlist){
                playlist = data.playlist
                setPlaylist([...playlist]);
            }else{
                if(data.url){
                    playlist = [{
                        url: data.url
                    }]
                    setPlaylist([...playlist]);
                }else{
                    setPlaylist([]);
                }
            }
        }
    }

    const getMessage = (messageArray, username) => {
        const length = messageArray.length;
        if(length != 0){
            const index = Math.floor(Math.random() * length);
            const message = messageArray[index];
            return message.replace('${user}', username);
        }else{
            return undefined;
        }
    }

    const memberAction = (type, id, name = 'dummy') => {
        if (type === 1) {
            if(memberlist.filter((val) => val.id === id).length === 0){
                memberlist.push({
                    id,
                    name
                });
            }
        }else if(type === 2){
            memberlist = memberlist.filter((val) => val.id !== id);
        }
        memberlist = memberlist.filter((x, i, a) => a.indexOf(x) == i);
        memberlist = [...new Set(memberlist)];
        setMember([...memberlist]);
    }

    const handleEvent = async (event) => {
        const user = event.user;
        const username = await getUsername(user);
        const data = {
            type: event.type,
            username
        }
        let keySearch = true;

        for(let key in config.EVENT){
            if(config.EVENT[key].KEYWORD === event.type){
                keySearch = false;
                data.message = getMessage(config.EVENT[key].MESSAGE, username);
            }
        }
        if(keySearch){
            for (let key in config.EVENT.PLAYER) {
                if (config.EVENT.PLAYER[key].KEYWORD === event.type) {
                    data.message = getMessage(config.EVENT.PLAYER[key].MESSAGE, username);
                }
            }
        }
        switch (event.type) {
            case config.EVENT.ADD.KEYWORD:
                memberAction(1, user, username);
                break;

            case config.EVENT.REMOVE.KEYWORD:
                memberAction(2, user, username);
                break;
            case config.EVENT.LOAD.KEYWORD:
                loadMedia(event.message,true,false);
                break;
            case config.EVENT.MESSAGE.KEYWORD:
                data.message = event.message;
                break;
            case config.EVENT.PLAYER.PLAY.KEYWORD:
                setPlaying(true);
                break;
            case config.EVENT.PLAYER.PAUSE.KEYWORD:
                setPlaying(false);
                break;
            case config.EVENT.PLAYER.SEEK_FORWARD.KEYWORD:
                if(user !== userId){
                    ref.current.seek('forward', event.message + getTimeDiff(event.createdAt));
                }
            case config.EVENT.PLAYER.SEEK_BACKWARD.KEYWORD:
                if(user !== userId){
                    ref.current.seek('backward', event.message - getTimeDiff(event.createdAt));
                }
            case config.EVENT.PLAYLIST.KEYWORD:
                checkRoomDetails(); // [TODO] This is supposed to check just the playlist and not the whole room details.
                break;
            case config.EVENT.GIF.KEYWORD:
                data.message = event.message;
                break;
        }
        return data;
    }

    const updateRoomProgress = (progress) => {
        if(members?.get(userId)?.isHost){
            firestore.updateRoomDetails(id, src, progress, playlist);
        }
    }

    const createEvent = (type, message = '') => {
        firestore.createEvent(id, type, userId, message);
    }

    const navigation = [{
            key: 'Chat',
            counter: msgCounter,
            component: <Chat 
                className="chat" 
                messages = {messages} 
                createEvent = {createEvent}
            />
        }, 
        {
            key: 'PlayList',
            component: <PlayList 
                            className="chat" 
                            playlist = {playlist} 
                            loadMedia = {loadMedia} 
                            appendToPlaylist = {appendToPlaylist} 
                            mediaEnd = {mediaEnd} 
                            playListAction = {playListAction}
                            setPlaylist = {setPlaylist}
                        />
        },
        {
            key: 'Members',
            component: <Members
                            members = {memberlist}
                        />
        }
    ]

    const setRoomId = () => {
         const search = location.search;
         const roomId = new URLSearchParams(search).get('track');
         id = roomId;
         setId(id);
    }

    useEffect(()=>{
        setRoomId();
        checkRoomDetails();
        const username = checkUsername();
        setName(username);
        updateMembers().then((res)=> {
            createMember(username).then((res) => {
                firestore.events(id).onSnapshot(querySnapshot => {
                    const promiseArray = [];
                    const changes = querySnapshot.docChanges()
                    changes.forEach(change => {
                        promiseArray.push(new Promise((res,rej)=>{
                            handleEvent(change.doc.data())?.then((result) => {
                                res(result);
                            }).catch((ex) => {
                                rej(ex);
                            })
                        }))
                    });
                    Promise.all(promiseArray).then((newMessages) => {
                        messages = messages.concat(newMessages);
                        if (active == 0) {
                            prevMsg = 0;
                            setMsgCounter(0);
                        }else if (prevMsg != messages.length) {
                            setMsgCounter(messages.length - prevMsg);
                            prevMsg = messages.length;
                        }
                        setMessages([...messages]);
                    }); 
                })
            });
        });
        return () => {
            firestore.createEvent(id, config.EVENT.REMOVE.KEYWORD, userId, '');
        }
    },[]);

    const onNavClick = (index) => {
        setActive(index);
        if(index == 0){
            prevMsg = 0;
            setMsgCounter(0);
        }
    }
    
    return (
        <div className={styles.room_container}>
            <nav className={styles.options}>
                {navigation.map((nav, index) => {
                    return <a key={index} className={`${active === index ? styles.nav_active : ''}`} onClick={() => { onNavClick(index) }}>{nav.key}{(nav?.counter ? `(${nav.counter})` : '' )}</a>
                })}
            </nav>
            <div className={styles.wrapper}>
                <Player 
                    className="player" 
                    src={src} 
                    createEvent = {createEvent} 
                    playing={playing} 
                    updateRoomProgress= {updateRoomProgress} 
                    playListAction= {playListAction} 
                    seek={seek} 
                    ref = {ref}
                />
                {navigation[active].component}
            </div>
            <div className={styles.details}>
                {!isHost && <button onClick={checkRoomDetails}>RE-SYNC</button>}
            </div>
            <div className={styles.wave}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#641ba8cc" fillP="1" d="M0,128L24,133.3C48,139,96,149,144,144C192,139,240,117,288,128C336,139,384,181,432,186.7C480,192,528,160,576,170.7C624,181,672,235,720,256C768,277,816,267,864,272C912,277,960,299,1008,266.7C1056,235,1104,149,1152,112C1200,75,1248,85,1296,101.3C1344,117,1392,139,1416,149.3L1440,160L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path></svg>
            </div>  
        </div>
    )
}

export default Room
