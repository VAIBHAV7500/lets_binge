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
        setGif(data);
    })
  },[]);
  return gif && <Gif gif={gif} width={250} className={styles.single_giphy}/>;
}

function Chat({messages, createEvent}) {
    let room;
    const dummy = useRef();

    const [gif, setGif] = useState(false);
    const [search, setSearch] = useState('');

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
            const processedMsg = msg.split(' ');
            if (processedMsg[0].includes(`/giphy`)) {
                setGif(true);
            } else {
                setGif(false);
                setSearch('');
            }
        }       
    }

    const getChatBubble = (data,index) => {
        if(data.type === config.EVENT.MESSAGE.KEYWORD){
            return (<div className={styles.bubble} key={index}>
                {data.username && <div className={styles.username}>{data.username}:</div>}
                <div className={`${styles.message} ${styles.message_type}`}>{data.message}</div>
            </div>);
        }else if(data.type === config.EVENT.GIF.KEYWORD){
            return (<div className={styles.bubble} key={index}>
                {data.username && <div className={styles.username}>{data.username}:</div>}
                <div className={styles.message}>
                    <GifSingle gifId={data.message} className={styles.single_giphy}/>
                </div>
            </div>);
        }else{
            return (<div className={styles.bubble} key={index}>
                <div className={`${styles.message} ${styles.extra_type}`}><span>{data.message}</span></div>
            </div>);
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.message_area}>
                {search == '' && messages && messages.map((msg,index) => {
                    return (msg?.message) ? getChatBubble(msg,index) : ''
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
