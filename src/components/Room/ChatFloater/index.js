import React from 'react';
import styles from './styles.module.css';

/*

{
    title: 
    data: Some Msg
    onClick: 
    extra: some integer,
    timeout: 
    onClose: 
}

*/

const ChatFloater = ({data, onBodyClick, onFloatClose}) => {

    const onFloatClick = (event) => {
        if (event.target.className !== styles.close) {
            onBodyClick();
        }
    }

    const onClose = () => {
        onFloatClose();
    }

    return (
        <div className={styles.body} onClick={onFloatClick}> 
            <div className={`${styles.block}`}>
                < div className = {styles.data} > {data} </div>
                <div className={styles.close} onClick={onClose}>Close</div>
            </div>
        </div>
    )
}

export default ChatFloater
