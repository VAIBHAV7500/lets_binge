import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';
import firestore from '../../config/firestore';
import { lazy } from "react";

import IntroContent from "../../content/IntroContent.json";
import MiddleBlockContent from "../../content/MiddleBlockContent.json";
import RealTimeChat from "../../content/RealTimeChat.json";
import PlaylistContent from "../../content/PlaylistContent.json";
import ProductContent from "../../content/ProductContent.json";
import ContactContent from "../../content/ContactContent.json";
import TheatreMode from '../../content/TheatreMode.json';

const ContactFrom = lazy(() => import("./ContactForm"));
const ContentBlock = lazy(() => import("./ContentBlock"));
const MiddleBlock = lazy(() => import("./MiddleBlock"));
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
            sub = {IntroContent.sub_title}
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
            createRoom = {createRoom}
            id="about"
        />
        <ContentBlock
            type="left"
            title = {
                PlaylistContent.title
            }
            content = {
                PlaylistContent.text
            }
            id="playlist"
            icon="playlist.svg"
        />

        <ContentBlock
            type="right"
            title = {
                RealTimeChat.title
            }
            content = {
                RealTimeChat.text
            }
            section = {
                RealTimeChat.section
            }
            icon ="chat.svg"
            id="chat"
        />
        <ContentBlock
            type="left"
            title = {
                TheatreMode.title
            }
            content = {
                TheatreMode.text
            }
            section = {
                TheatreMode.section
            }
            icon ="media_player.svg"
            id="theatre_mode"
        />
        <ContentBlock
            type="right"
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

export default Home;