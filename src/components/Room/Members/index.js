import React, {useEffect,useState} from 'react';
import styles from './members.module.css';

function Members({
    members,
    height
}) {
    return (
        <div className={styles.body} style={{height}}>
            <div className={styles.message_area}>
                {members && members.map((msg,index) => {
                    return <div className={styles.bubble} key={index}>
                        <div className={styles.message}>{`${msg.username} ${(msg.isHost ? ' [Host]' : '')}`}</div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Members
