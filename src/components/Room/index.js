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
import helper from './helper';

let prevMsg = 0;

let currUser = {};

function Room() {
    const location = useLocation();
    const ref = useRef();
    const [src, setSrc] = useState();
    const [ name , setName ] = useState('YOU');
    const [active, setActive] = useState(0);
    const [ playing, setPlaying ] = useState(false);
    const [seek, setSeek] = useState(0);
    const [loading, setLoading] = useState(true);
    const [msgCounter, setMsgCounter] = useState(0);
    let [id, setId] = useState(null);
    let [userId, setUserId] = useState(null);
    let [messages, setMessages] = useState([]);
    let [playlist, setPlaylist] = useState([]);
    let [members, setMembers] = useState([]);

    const height = '100%';

    const loadMedia = async (url, force = false, event = true,user = undefined) => {
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
                username: await getUsername(user || currUser.id),
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
                username: await getUsername(currUser.id),
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
        const list = [];
        result.forEach((member) => {
            const data = member.data();
            list.push({
                id: member.id,
                username: data.username,
                isHost: data.isHost
            });
        });
        members = list;
        setMembers([...members]);
    }

    const createMember = async (username) => {
        const user = helper.getUserByName(members, username);
        if (!user) {
            const firstUser = members.length === 0 ? true : false;
            userId = await firestore.createMember(id, username, firstUser); // Making First User as Host by default.
            const data = {
                id: userId,
                username: username,
                isHost: firstUser
            };
            members = helper.addMemberToList(members, data);
            setMembers([...members]);
            firestore.createEvent(id, config.EVENT.ADD.KEYWORD, userId, data);
            setUserId(userId);
            return data;
        }
        setUserId(user.id);
        return user;
    }

    const getUsername = async (user_id) => {
        const user = helper.getUserById(members,user_id);
        let username = user?.username;
        if(username == null){
            if(id && user_id){
                const res = await firestore.findMember(user_id, id);
                if (res) {
                    const data = res.data();
                    if(data){
                        username = data.username;
                        members = helper.addMemberToList(members, data)
                        setMembers([...members]);
                    }
                }
            }
        }
        return username;
    }

    const memberAction = (type, data) => {
        if (type === 1) {
            members = helper.addMemberToList(members, data)
            setMembers([...members]);
        } else if (type === 2) {
            members = helper.removeMemberFromList(members, data);
            setMembers([...members]);
        }
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
        if(currUser?.isHost){
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
                memberAction(1, event.message);
                break;

            case config.EVENT.REMOVE.KEYWORD:
                memberAction(2, user);
                break;
            case config.EVENT.LOAD.KEYWORD:
                console.log('IN LOAD HANDLE');
                loadMedia(event.message,true,false,user);
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
                    ref.current.seek('forward', event.message + helper.getTimeDiff(event.createdAt));
                }
                break;
            case config.EVENT.PLAYER.SEEK_BACKWARD.KEYWORD:
                if(user !== userId){
                    ref.current.seek('backward', event.message - helper.getTimeDiff(event.createdAt));
                }
                break;
            case config.EVENT.PLAYLIST.KEYWORD:
                checkRoomDetails();
                //checkRoomDetails(); // [TODO] This is supposed to check just the playlist and not the whole room details.
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
                            members = {members}
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
                currUser = res;
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
                {<Button width={true} onClick={checkRoomDetails}>RE-SYNC</Button>}
            </div> 
        </div>
    )
}

export default Room
