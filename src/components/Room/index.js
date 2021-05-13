import React,{useEffect, useState, useRef} from 'react';
import Player from './player';
import Chat from './Chat';
import PlayList from './PlayList';
import Members from './Members';
import styles from './room.module.css';
import config from '../../config';
import { useLocation } from "react-router-dom";
import LocalStorage from '../utils/local_storage';
import firestore from '../../config/firestore';
import Button from '../../common/Button';
import PageLoader from '../../common/PageLoader';
import Footer from '../Footer';
import helper from './helper';

let members = new Map();
let prevMsg = 0;

function Room() {
    const location = useLocation();
    const ref = useRef();
    const [src, setSrc] = useState('');
    const [ name , setName ] = useState('YOU');
    const [active, setActive] = useState(0);
    const [ playing, setPlaying ] = useState(false);
    const [seek, setSeek] = useState(0);
    const [loading, setLoading] = useState(true);
    let [messages, setMessages] = useState([]);
    let [playlist, setPlaylist] = useState([]);
    let [memberlist, setMember] = useState([]);
    const [msgCounter, setMsgCounter] = useState(0);
    let isHost = false;
    let [id, setId] = useState(null);
    let [userId, setUserId] = useState(null);
    const height = '100%';

    const getTimeDiff = (time) => {
        const currTime = new Date().getTime();
        return (currTime - time)/1000; // returning seconds
    } 

    const loadMedia = async (url, force = false, event = true) => {
        const finalSrc = helper.checkURL(url); 
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
                username: await getUsername(),
                userId
            });
            setPlaylist([...playlist]);
        }
    }

    const appendToPlaylist = async (url) => {
        const finalSrc = helper.checkURL(url);
        if(finalSrc){
            playlist.push({
                url,
                username: await getUsername(),
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
            default:
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
            do{
                username = prompt('Enter Username');
            }while(username === null);
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
        members = new Map()
        memberlist.forEach(x => members.set(x.id,{
            name: x.name,
            isHost: x.isHost
        }));
        setMember([...memberlist]);
    }

    const createMember = async (username) => {
        const room = LocalStorage.get(id);
        if(room && room.member){
            userId = room.member;
            setUserId(userId);
            const isHost = memberlist.length === 0 ? true : false
            members.set(userId, {
                name: username,
                isHost 
            });
            memberlist.push({
                id: userId,
                name: username,
                isHost
            });
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
                name: username,
                isHost: isOwner
            });
        }
        memberlist = [...new Set(memberlist)];
        setMember([...memberlist]);
        firestore.createEvent(id, config.EVENT.ADD.KEYWORD, userId, '');
    }

    const getUsername = async (user) => {
        let username = members.get(user)?.name;
        if(username !== null){
            const res = await firestore.findMember(user, id);
            username = res?.name;
            if(res){
                members.set(res.id, {
                    name: res.name,
                    isHost: res.isHost
                });
                memberlist.push(res);
                memberlist = [...new Set(memberlist)];
                setMember([...memberlist]);
            }
        }
        return username;
    }

    const memberAction = (type, id, name = 'dummy') => {
        if (type === 1) {
            if (memberlist.filter((val) => val.id === id).length === 0) {
                memberlist.push({
                    id,
                    name
                });
            }
        } else if (type === 2) {
            memberlist = memberlist.filter((val) => val.id !== id);
        }
        memberlist = memberlist.filter((x, i, a) => a.indexOf(x) == i);
        memberlist = [...new Set(memberlist)];
        setMember([...memberlist]);
    }

    const checkRoomDetails = async () => {
        const res = await firestore.getARoom(id);
        if (res) {
            const data = res.data();
            if (data.src) {
                setSrc(data.src);
            }
            if (data.progress) {
                setSeek(data.progress);
            }
            if (data?.playlist?.length) {
                playlist = data.playlist;
                setPlaylist([...playlist]);
            } else {
                if (data.src && data.src !== '') {
                    playlist = [{
                        url: data.src
                    }]
                    setPlaylist([...playlist]);
                } else {
                    setPlaylist([]);
                }
            }
        }
    }

    const setRoomId = () => {
        const search = location.search;
        const roomId = new URLSearchParams(search).get('track');
        id = roomId;
        setId(id);
    }

    const updateRoomProgress = (progress) => {
        if (members?.get(userId)?.isHost) {
            firestore.updateRoomDetails(id, src, progress, playlist);
        }
    }

    const createEvent = (type, message = '') => {
        firestore.createEvent(id, type, userId, message);
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
                data.message = helper.getMessage(config.EVENT[key].MESSAGE, username);
            }
        }
        if(keySearch){
            for (let key in config.EVENT.PLAYER) {
                if (config.EVENT.PLAYER[key].KEYWORD === event.type) {
                    data.message = helper.getMessage(config.EVENT.PLAYER[key].MESSAGE, username);
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
                break;
            case config.EVENT.PLAYER.SEEK_BACKWARD.KEYWORD:
                if(user !== userId){
                    ref.current.seek('backward', event.message - getTimeDiff(event.createdAt));
                }
                break;
            case config.EVENT.PLAYLIST.KEYWORD:
                checkRoomDetails(); // [TODO] This is supposed to check just the playlist and not the whole room details.
                break;
            case config.EVENT.GIF.KEYWORD:
                data.message = event.message;
                break;
            default:
                break;
        }
        return data;
    }

    const navigation = [{
            key: 'Chat',
            counter: msgCounter,
            component: <Chat 
                className="chat" 
                messages = {messages} 
                createEvent = {createEvent}
                height={height}
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
                            height={height}
                        />
        },
        {
            key: 'Members',
            component: <Members
                            members = {memberlist}
                            height={height}
                        />
        }
    ];

    const onRoomLoad = () => {
        setRoomId();
        checkRoomDetails().then(() => {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        });
        const username = checkUsername();
        setName(username);
        updateMembers().then((res) => {
            createMember(username).then((res) => {
                firestore.events(id).onSnapshot(querySnapshot => {
                    const promiseArray = [];
                    const changes = querySnapshot.docChanges()
                    changes.forEach(change => {
                        promiseArray.push(new Promise((res, rej) => {
                            handleEvent(change.doc.data())?.then((result) => {
                                res(result);
                            }).catch((ex) => {
                                rej(ex);
                            })
                        }))
                    });
                    Promise.all(promiseArray).then((newMessages) => {
                        messages = messages.concat(newMessages);
                        if (active === 0) {
                            prevMsg = 0;
                            setMsgCounter(0);
                        } else if (newMessages.length) {
                            setMsgCounter(msgCounter + newMessages.length);
                            prevMsg = messages.length;
                        }
                        setMessages([...messages]);
                    });
                })
            });
        });
    }

    useEffect(()=>{
        onRoomLoad();
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
            {loading && <PageLoader title="Loading Room..."/>}
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
                {!isHost && <Button width={true} onClick={checkRoomDetails}>RE-SYNC</Button>}
            </div> 
        </div>
    )
}

export default Room
