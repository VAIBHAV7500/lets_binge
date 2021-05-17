import React, {useEffect,useState} from 'react';
import styles from './members.module.css';
import { FiEdit2 } from "react-icons/fi";
import config from '../../../config';

const hostSymbol = '👑';

function Members({
    members,
    height,
    currUser,
    updateMembers,
    isMinized,
    theatreMode
}) {

    const [showUpdate, setUpdate] = useState(false);
    const [error, setError] = useState();

    const updateButton = () => {
        setUpdate(true);
    }

    const usernameExists = (username) => {
        return members.some(x => x.username.toLowerCase() === username.toLowerCase());       
    }

    const onClickUpdate = () => {
        const element = document.getElementById('username');
        if(element?.value){
            let value = element.value;
            value = value.replaceAll(hostSymbol, '').trim();
            if (usernameExists(value)){
                setError(config.USERNAME_ERROR);
                setTimeout(() => {
                    setError();
                }, 2000);
            }else{
                updateMembers(value);
                setUpdate(false);
            }
        }
    }

    const getRow = (index, user) => {
        const username = `${user.username}   ${(user.isHost ? hostSymbol : '')}`;
        if(user.id === currUser.id && showUpdate){
            return (<div className={styles.bubble} key={index}>
                        <input id="username" className={styles.message_input} type="text" defaultValue={username} onChange={updateButton}></input>
                        <button className={styles.username_btn} onClick={onClickUpdate}>Update Username</button>
                        {error && <div className={styles.username_error}>{error}</div>}
                    </div>);
        }else{
            return (<div className={styles.bubble} key={index}>
                        <div className={styles.message}>
                            {username}
                            {currUser.id === user.id && <FiEdit2 style={{paddingLeft: '6px', width: '20%'}} onClick={() => {setUpdate(true)}}/>}
                        </div>
                    </div>);
        }
    }

    return (
        <div className={styles.body} style={{height}}>
            <div className={styles.message_area}>
                {members && members.map((msg,index) => {
                    return getRow(index,msg)
                })}
            </div>
        </div>
    )
}

export default Members
