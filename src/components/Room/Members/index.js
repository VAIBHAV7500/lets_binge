import React, {useEffect,useState, useRef} from 'react';
import styles from './members.module.css';

function Members({
    members,
    height
}) {
    const dummy = useRef();
    useEffect(() => {
        members = [...new Set(members)];
    },[members])
    return (
        <div className={styles.body} style={{height}}>
            <div className={styles.message_area}>
                {members && members.map((msg,index) => {
                    return <div className={styles.bubble} key={index}>
                        {msg.username && <div className={styles.username}>{msg.username}:</div>}
                        <div className={styles.message}>{`${msg.name} ${(msg.isHost ? ' [Host]' : '')}`}</div>
                    </div>
                })}
                {/* <span ref={dummy}></span> */}
            </div>
            {/* <div className={styles.input_message}>
                <input type="text" id="url" placeholder={"DROP YOUR LINK HERE"}></input>
                <button >LOAD</button>
                <button id="playlist">Add to PlayList</button>
            </div> */}
        </div>
    )
}

export default Members
