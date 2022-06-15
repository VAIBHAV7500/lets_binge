import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './index';
import settings from '../config/settings';
import utils from '../utils/local_storage';

require('firebase/auth');
require('firebase/database');

const FIREBASE = config.FIREBASE;

const room_collection = "rooms";
const member_collection = "members";
const event_collection = "events";
const feedback_collection = "feedback"


const initializeFirebase = () => {
    firebase.initializeApp({
        apiKey: FIREBASE.API_KEY,
        authDomain: FIREBASE.AUTH_DOMAIN,
        projectId: FIREBASE.PROJECT_ID,
        storageBucket: FIREBASE.STORAGE_BUCKET,
        messagingSenderId: FIREBASE.MESSAGING_SENDER_ID,
        appId: FIREBASE.APP_ID,
        measurementId: FIREBASE.MEASUREMENT_ID
    });
}

const getFireStore = (database = false) => {
    if (firebase.apps.length === 0) {
        initializeFirebase();
    }
    if(database){
        return firebase.database();
    }
    const firestore = firebase.firestore();
    return firestore;
}

const getDatabase = () => {
    return getFireStore(true);
}

const createRoom = async () => {
    const firestore = getFireStore();
    var d = new Date();
    var n = d.getTime();
    const res = await firestore.collection(room_collection).add({
        name: 'Demo Room',
        src: '',
        progress: 0,
        playlist: [],
        settings,
        isActive: true,
        createdAt: n
    });
    console.log(res);
    utils.setRoom({
        id: res.id
    });
    return res.id;
}

const createMember = async (room, username, isHost) => {
    const firestore = getFireStore();
    
    const data = {
        username,
        isHost
    };
    const res = await firestore.collection(room_collection).doc(room).collection(member_collection).add(data);
    return res.id;
}

const createFirebaseMember = async (room,member) => {
    const database = getDatabase();
    member.isOnline = member.isOnline || true;
    await database.ref(`/room/${room}/members/${member.id}/`).set(member);
}

const onOffline = (room,member) => {
    const database = getDatabase();
    const data = member;
    data.isOnline = false;
    database.ref(`/room/${room}/members/${member.id}/`).onDisconnect().set(data);
}

const updateMembers = (room,member) => {
    const firestore = getFireStore();
    firestore.collection(room_collection).doc(room).collection(member_collection).doc(member.id).set(member);
    createFirebaseMember(room,member);
}

const createEvent = async (room, type, user, message) => {
    if(!user){
        return;
    }
    const firestore = getFireStore();
    var d = new Date();
    var n = d.getTime();
    const res = await firestore.collection(room_collection).doc(room).collection(event_collection).add({
        type,
        user,
        message,
        createdAt: n
    });
    return res.id;
}

const rooms = () => {
    const firestore = getFireStore();
    const messagesRef = firestore.collection('rooms');
    const query = messagesRef;
    return query;
}

const events = (room) => {
    const firestore = getFireStore();
    const query = firestore.collection('rooms').doc(room).collection('events').orderBy('createdAt')
    return query;
}

const members = (room) => {
    const database = getDatabase();
    return database.ref(`/room/${room}/members`);
}

const getLastEvents = async (room) => {
    const firestore = getFireStore();
    const eventRef = firestore.collection('rooms').doc(room).collection('events');
    return await eventRef.limit(25).get();
}

const getMembers = async (room, onlineOnly = true) => {
    const database = getDatabase();
    const result = (await database.ref(`/room/${room}/members`).get()).val();
    // Changing it to list
    const list = [];
    for(let key in result){
        if(result.hasOwnProperty(key)){
            const member = result[key];
            if(onlineOnly && member.hasOwnProperty('isOnline') && member.isOnline === false){
                continue;
            }
            list.push(member);
        }
    }
    return list;
}

const findMember = async (id,room) => {
    const firestore = getFireStore();
    const memberRef = firestore.collection(room_collection).doc(room).collection(member_collection);
    return (await memberRef.doc(id).get());
}

const findMemberByUsername = async (room,username) => {
    const firestore = getFireStore();
    const memberRef = firestore.collection(room_collection).doc(room).collection(member_collection);
    return (await memberRef.where('username', '==', username).get());
}

const updateRoomDetails = (room, data) => {
    const firestore = getFireStore();
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])
    console.log(data);
    firestore.collection(room_collection).doc(room).update(data);
}

const updatePlaylist = async (playlist,room) => {
    if(room){
        const firestore = getFireStore();
        firestore.collection(room_collection).doc(room).update({
            playlist
        });
    }
}

const getARoom = async (roomsArr) => {
    const firestore = getFireStore();
    //const memberRef = firestore.collection(room_collection).doc(room);
    const chunkedRooms = utils.chunkify(roomsArr, 10);
    const promiseArr = [];
    chunkedRooms.forEach((rooms) => {
        promiseArr.push( new Promise(async (res,rej) => {
            const memberRef = firestore.collection(room_collection).where(firebase.firestore.FieldPath.documentId(), 'in', rooms);
            const result = await memberRef.get();
            res(result?.docs);
        }))
    });
    const result = await Promise.all(promiseArr);
    return [].concat(...result); // flattening the array
}

const sendMessage = async (data) => {
    const firestore = getFireStore();
    const res = await firestore.collection(feedback_collection).add(data);
    return res.id;
}

const destroyRoom = (room) => {
    const firestore = getFireStore();
    return firestore.collection(room_collection).doc(room).delete();
}

export default {
    initializeFirebase,
    getFireStore,
    createRoom,
    createMember,
    rooms,
    createEvent,
    events,
    members,
    getLastEvents,
    getMembers,
    findMember,
    updateRoomDetails,
    getARoom,
    updatePlaylist,
    sendMessage,
    updateMembers,
    onOffline,
    createFirebaseMember,
    findMemberByUsername,
    destroyRoom
}
