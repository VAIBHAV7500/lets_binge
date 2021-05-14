import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './index';

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

const getFireStore = () => {
    if (firebase.apps.length === 0) {
        initializeFirebase();
    }
    const firestore = firebase.firestore();
    return firestore;
}

const createRoom = async () => {
    const firestore = getFireStore();
    const res = await firestore.collection(room_collection).add({
        name: 'Demo Room',
        src: '',
        progress: 0,
        playlist: []
    });
    return res.id;
}

const createMember = async (room, username, isHost) => {
    const firestore = getFireStore();
    const res = await firestore.collection(room_collection).doc(room).collection(member_collection).add({
        username,
        isHost
    });
    return res.id;
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
    const firestore = getFireStore();
    const query = firestore.collection('rooms').doc(room).collection('members');
    return query;
}

const getLastEvents = async (room) => {
    const firestore = getFireStore();
    const eventRef = firestore.collection('rooms').doc(room).collection('events');
    return await eventRef.limit(25).get();
}

const getMembers = async (room) => {
    const firestore = getFireStore();
    const memberRef = firestore.collection(room_collection).doc(room).collection(member_collection);
    return await memberRef.get();
}

const findMember = async (id,room) => {
    const firestore = getFireStore();
    const memberRef = firestore.collection(room_collection).doc(room).collection(member_collection);
    return (await memberRef.doc(id).get());
}

const updateRoomDetails = (room,src,progress,playlist) => {
    const firestore = getFireStore();
    console.log('Calling Update Room Details');
    console.log(playlist);
    firestore.collection(room_collection).doc(room).update({
        src,
        progress,
        playlist
    });
}

const updatePlaylist = async (playlist,room) => {
    const firestore = getFireStore();
    console.log('Room',room);
    console.log('Playlist',playlist);
    console.log('Calling Update Playlist Details');
    firestore.collection(room_collection).doc(room).update({
        playlist: [...playlist]
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
}

const getARoom = async (room) => {
    const firestore = getFireStore();
    const memberRef = firestore.collection(room_collection).doc(room);
    return await memberRef.get();
}

const sendMessage = async (data) => {
    const firestore = getFireStore();
    const res = await firestore.collection(feedback_collection).add(data);
    return res.id;
}

export default {
    initializeFirebase,
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
    sendMessage
}
