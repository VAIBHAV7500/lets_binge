import React, {useEffect,useState, useRef} from 'react';
import firestore from '../../../config/firestore';
import {
    useCollectionData
} from 'react-firebase-hooks/firestore';
import styles from './chat.module.css';

function Chat({messages, addMessage}) {
    let room;
    const dummy = useRef();

    useEffect(() => {
       // createRoom();
        return () => {
        }
    });

    useEffect(() => {
        dummy.current.scrollIntoView();
    }, [messages])

    const sendMessage = () => {
        const element = document.getElementById('msg');
        const msg = element.value;
        if(msg){
            addMessage(msg);
            element.value = '';
        }
    }

    const handleKey = (e) => {
        if (e.which === 13) {
            sendMessage();
        }
    }

    const query = firestore.rooms();

    return (
        <div className={styles.body}>
            <div className={styles.message_area}>
                {messages && messages.map((msg) => {
                    return <div className={styles.bubble}>
                        {msg.username && <div className={styles.username}>{msg.username}:</div>}
                        <div className={styles.message}>{msg.message}</div>
                    </div>
                })}
                <span ref={dummy}></span>
            </div>
            <div className={styles.input_message}>
                <input onKeyPress={handleKey} type="text" id="msg" placeholder={"Say Hi!"}></input>
                <button onClick={sendMessage}>SEND</button>
            </div>
        </div>
    )
}

export default Chat
