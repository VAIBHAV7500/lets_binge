import React, {useEffect,useState, useRef} from 'react';
import styles from './chat.module.css';
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif, Grid } from "@giphy/react-components";
import config from '../../../config';

const giphyFetch = new GiphyFetch(config.GIPHY.KEY);

function GiphyGrid({
    search,
    createEvent,
    setGif,
    setSearch,
    clearSearchBox
}) {

    const onClickGif = (g,e) => {
        e.preventDefault();
        const gifId = g.id;
        if(gifId){
            createEvent(config.EVENT.GIF.KEYWORD, gifId);
        }   
        setGif(false);
        setSearch('');
        clearSearchBox();
    }

    const Overlay = ({ gif, isHovered }) => {
        return <div className={styles.overlay}>{isHovered ? <span className={styles.send}>SEND</span> : ''}</div> 
    }
    
    const fetchGifs = (offset = 10) => {
        if(search){
            return giphyFetch.search( search , {
                offset,
                limit: 10
            })
        }else{
            return giphyFetch.trending({
                offset,
                limit: 10
            });
        }
    };


    const [width, setWidth] = useState(0.3 * window.innerWidth);
    return (
        <>
        <Grid
            onGifClick={onClickGif}
            fetchGifs={fetchGifs}
            width={width}
            columns={3}
            gutter={6}
            overlay={Overlay}
        />
        {/* <ResizeObserver
            onResize={({ width }) => {
            setWidth(width);
            }}
        /> */}
        </>
    );
}

function GifSingle({gifId}) {
  const [gif, setGif] = useState(null);
  useEffect(() => {
    giphyFetch.gif(gifId).then(({data}) => {
        console.log('Data: ');
        console.log(data);
        setGif(data);
    })
  },[]);
  return gif && <Gif gif={gif} width={200} className={styles.single_giphy}/>;
}

function Chat({messages, createEvent}) {
    let room;
    const dummy = useRef();

    const [gif, setGif] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
       // createRoom();
        return () => {
        }
    });

    useEffect(() => {
        dummy.current.scrollIntoView();
    });

    const addMessage = (msg) => {
        createEvent(config.EVENT.MESSAGE.KEYWORD, msg);
    }

    const clearSearchBox = () => {
        const element = document.getElementById('msg');
        element.value = '';
    }

    const sendMessage = () => {
        const element = document.getElementById('msg');
        const msg = element.value;
        if(msg && !gif){
            addMessage(msg);
        }else{
            if (msg.includes(`/giphy`)) {
                setSearch(msg.split(`/giphy`)[1]?.trim());
            } else {
                setGif(false);
            }
        }
        element.value = '';
    }

    const handleKey = (e) => {
        const element = document.getElementById('msg');
        let msg = element.value;
        if (e.which === 13) {
            if(gif){
                setSearch(msg.split(`/giphy`)[1]?.trim());
            }else{
                sendMessage();
            }
            return;
        }
        if(msg){
            msg = msg.toLowerCase();
            if (msg.includes(`/giphy`)) {
                setGif(true);
            } else {
                setGif(false);
                setSearch('');
            }
        }       
    }

    return (
        <div className={styles.body}>
            <div className={styles.message_area}>
                {search == '' && messages && messages.map((msg,index) => {
                    return (msg) ? <div className={styles.bubble} key={index}>
                        {msg.username && <div className={styles.username}>{msg.username}:</div>}
                        <div className={styles.message}>{(msg?.type === config.EVENT.GIF.KEYWORD ? <GifSingle gifId={msg.message} className={styles.single_giphy}/> : msg.message)}</div>
                    </div> : ''
                })}
                {
                    search != '' && < GiphyGrid 
                        search={search}
                        createEvent = {createEvent}
                        setGif = {setGif}
                        setSearch = {setSearch}
                        clearSearchBox = {clearSearchBox}
                    />
                }
                <span ref={dummy}></span>
            </div>
            { gif != '' && <><span className={styles.giphy_text}>Powered By Giphy</span><span className={styles.giphy_close} onClick={() => { setGif(false); setSearch(''); clearSearchBox(); }}>CLOSE</span></> }
            <div className={styles.input_message}>
                <input onKeyDown={handleKey} type="text" id="msg" placeholder={"Type /giphy YOUR SEARCH"}></input>
                <button onClick={sendMessage}>{gif ? 'SEARCH' : 'SEND'}</button>
            </div>
        </div>
    )
}

export default Chat
