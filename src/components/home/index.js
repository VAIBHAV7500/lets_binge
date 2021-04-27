import React, {useState} from 'react'
import { useParams, useHistory } from 'react-router-dom';
import firestore from '../../config/firestore';
import PageLoader from '../utils/page_loader';

const Home = () => {

    const history = useHistory();
    let [loading, setLoading] = useState(false);
    

    const goToRoom = (roomId) => {
        if (roomId) {
            history.push({
                pathname: `/room/${roomId}`,
            });
        }
    }

    const createRoom = () => {
        setLoading(true);
        firestore.createRoom().then((roomId) => {
            goToRoom(roomId);
        }).catch((err)=>{
            setLoading(false);
        })

    }

    return (
        <div>
            { loading && <PageLoader title={"Creating Room"}/>}
            <div>
                {/* <input type="text" id="url" placeholder="Enter URL" /> */}
                <button onClick={createRoom}>Create Room</button>
            </div>
        </div>
    )
}

export default Home
