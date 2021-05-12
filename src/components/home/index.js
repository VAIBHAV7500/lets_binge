import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';
import firestore from '../../config/firestore';
import PageLoader from '../utils/page_loader';
import { lazy } from "react";

import IntroContent from "../../content/IntroContent.json";
import MiddleBlockContent from "../../content/MiddleBlockContent.json";
import AboutContent from "../../content/AboutContent.json";
import MissionContent from "../../content/MissionContent.json";
import ProductContent from "../../content/ProductContent.json";
import ContactContent from "../../content/ContactContent.json";

const ContactFrom = lazy(() => import("../ContactForm"));
const ContentBlock = lazy(() => import("../ContentBlock"));
const MiddleBlock = lazy(() => import("../MiddleBlock"));
const Container = lazy(() => import("../../common/Container"));
const ScrollToTop = lazy(() => import("../../common/ScrollToTop"));

const Home = () => {

    const history = useHistory();
    let [loading, setLoading] = useState(false);
    

    const goToRoom = (roomId) => {
        if (roomId) {
            history.push({
                pathname: `/room`,
                search: `?track=${roomId}`
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
        <Container>
        <ScrollToTop />
        <ContentBlock
            type="right"
            first="true"
            title={IntroContent.title}
            content={IntroContent.text}
            button={IntroContent.button}
            createRoom = {createRoom}
            icon="together.svg"
            id="intro"
        />
        <MiddleBlock
            title={MiddleBlockContent.title}
            content={MiddleBlockContent.text}
            button={MiddleBlockContent.button}
            id="about"
        />
        <ContentBlock
            type="left"
            title={AboutContent.title}
            content={AboutContent.text}
            section={AboutContent.section}
            icon ="chat.svg"
            id="chat"
        />
        <ContentBlock
            type="right"
            title={MissionContent.title}
            content={MissionContent.text}
            id="playlist"
            icon="playlist.svg"
        />

        <ContentBlock
            type="left"
            title={ProductContent.title}
            content={ProductContent.text}
            icon="cat.svg"
            id="cat"
        />
        <ContactFrom
            title={ContactContent.title}
            content={ContactContent.text}
            sendMessage={firestore.sendMessage}
            id="feedback"
        />
        </Container>
    );
}

export default Home


// <div>
//     { loading && <PageLoader title={"Creating Room"}/>}
//     <div>
//         {/* <input type="text" id="url" placeholder="Enter URL" /> */}
//         <button onClick={createRoom}>Create Room</button>
//     </div>
// </div>

