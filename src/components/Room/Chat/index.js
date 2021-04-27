import React, {useEffect} from 'react';
import firestore from '../../../config/firestore';
import {
    useCollectionData
} from 'react-firebase-hooks/firestore';
import styles from './chat.module.css'

function Chat() {
    let room;

    const createRoom = async () => {
       room = await firestore.createRoom();
       console.log(room);
       const member = await firestore.createMember(room);
       console.log(member);
    }
    useEffect(() => {
       // createRoom();
        return () => {
        }
    })

    const query = firestore.rooms();
    const [messages] = useCollectionData(query, {
        idField: 'id'
    });

    return (
        <div className={styles.body}>
            {/* {messages && messages.map((each) => {
                return <div key={each.id}>{each.name || 'Dummy'}</div>
            })} */}

            <div className={styles.input_message}>
                <input type="text" id="msg" placeholder={"Say Hi!"}></input>
                <button>SEND</button>
            </div>
        </div>
    )
}

export default Chat
