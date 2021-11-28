import React,{useEffect, useState, useRef} from 'react';
import utils from '../../utils/local_storage';
import firestore from '../../config/firestore';
import styles from './style.module.css';
import { useHistory } from 'react-router-dom';
import BarLoader from 'react-bar-loader'
import Button from '../../common/Button';

const YourRooms =() => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const onClickTile = (id, event) => {
        history.push({
            pathname: `/room`,
            search: `?track=${id}`
        });
    }

    const createRoom = () => {
        firestore.createRoom().then((id) => {
            onClickTile(id);
        });
    }

    const Tile = ({room}) => {
        return <div className={styles.tile} onClick={(event) => { onClickTile(room.id, event)}}>
            <div className={styles.title}>{room.name}</div>
            {room.playlist.length} videos available in the Playlist <br/>
            Hosted by {room.host.username} <br/>
            Total Online Users: {room.online} <br/>
            Total Members: {room.totalMembers}
            <div className={styles.date}>
                {room.createdAt}
            </div>
        </div>
    }

    let [rooms, setRooms ] = useState([]);
    const getRoomIds = async () => {
        const data = utils.get('rooms');
        if(data == null || data.length === 0){
            setLoading(false);
            return;
        }
        const ids = data.map(x => x.id);
        const response = ( await firestore.getARoom(ids) ) || [];
        const rData = [];
        const promiseArr = [];
        response.forEach((r) => {
            promiseArr.push(new Promise(async (res, rej) => {
                const members = await firestore.getMembers(r.id, false);
                const room = r.data();
                if (room.isActive) {
                    rData.push({
                        id: r.id,
                        name: room.settings?.sections[0]?.inputs[0]?.value || "Untitled Room",
                        progress: room.progress,
                        playlist: room.playlist,
                        createdAt: (new Date(room.createdAt)).toString(),
                        online: members.filter(x => x.isOnline === true).length || 0,
                        totalMembers: members.filter((x,i) => (members.find(val => val.username === x.username)).id === x.id).length,
                        host: members.find(x => x.isHost === true),
                    });
                }
                res(true);
            }));
        });
        await Promise.all(promiseArr);
        setRooms(rData);
        setLoading(false);
    };

    useEffect(() => {
        getRoomIds();
    }, [])
    return (
        <div class={styles.block}>
            {loading && <BarLoader color="#ee076e" height="2" />}
            <div id="room" className={styles.roomGrid}>
                {
                    rooms && rooms.map((room) => {
                        return <Tile room = {
                            room
                        } key={room.Id}
                        />
                    })
                }
                { loading == false && rooms && rooms.length === 0 && <div className={styles.noRooms}>
                    <div>No Rooms Available</div> 
                    <Button onClick={createRoom}> Create </Button>
                </div>}
            </div>
        </div>
    )
}

export default YourRooms;
