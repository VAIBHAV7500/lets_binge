import React, {useEffect,useState, useRef} from 'react';
import styles from './chat.module.css';
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif, Grid } from "@giphy/react-components";
import config from '../../../config';
import Button from '../../../common/Button';
import helper from '../helper';

const giphyFetch = new GiphyFetch(config.GIPHY.KEY);

const gifHeight = 200;

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


    const [width] = useState(0.3 * window.innerWidth);
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
  },[gifId]);
  return gif && <Gif gif={gif} width={gifHeight} className={styles.single_giphy}/>;
}

function Chat({messages, createEvent, height, isMinized,
    theatreMode, canPlay, playListAction}) {
    const dummy = useRef();

    const [gif, setGif] = useState(false);
    const [search, setSearch] = useState('');
    const [suggestion, setSuggestion] = useState();

    useEffect(() => {
        dummy.current.scrollIntoView();
    },[messages]);

    const addMessage = (msg) => {
        const result = helper.containsLink(msg);
        let isLink = false;
        let link = '';
        let playable = false;

        if(result){
            isLink = true;
            link = result;
            if(canPlay(link)){
                playable = true;
            }
        }
        const data = {
            isLink,
            link,
            msg,
            canPlay: playable
        }
        createEvent(config.EVENT.MESSAGE.KEYWORD, data);
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

    const openLink = (url) => {
        if(url && url !== ''){
            window.open(url, '_blank').focus();
        }
    }

    const addToPlaylist = (url) => {
        if(url){
            playListAction(1,url);
        }
    }

    const updateChatSuggestions = () => {
        let index = 1;
        let suggestions = config.CHAT_SUGGESTIONS;
        setSuggestion(suggestions[0]);
        setInterval(() => {
            if (index >= suggestions.length) {
                index = 0;
            }
            setSuggestion(suggestions[index]);
            index++;
        },10000);
    }

    useEffect(() => {
        updateChatSuggestions();
    },[])

    const getChatBubble = (data,index) => {
        const packet = data.message;
        const message = packet?.msg;
        const isLink = packet?.isLink;
        const link = packet?.link;
        const canPlay = packet?.canPlay;

        if(data.type === config.EVENT.MESSAGE.KEYWORD){
            let showUsername = true;
            if(index !== 0 && messages[index - 1].type === data.type && messages[index - 1].username === data.username){
                showUsername = false;
            }
            return (<div className={styles.bubble} key={index}>
                { showUsername && data.username && <div className={styles.username}>{data.username}:</div>}
                <div className={`${styles.message} ${styles.message_type}`} onClick={() => {openLink(link)}}>
                    {message} {(isLink) ? '↗' : ''}
                </div>
                {canPlay && <div className={styles.playlist_btn} onClick={() => {addToPlaylist(link)}}>Add to Playlist</div>}
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
        <div className={styles.body} style={{height}}>
            <div className={styles.message_area}>
                {search === '' && messages && messages.map((msg,index) => {
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
            { (gif != '' && !isMinized) && <div className={styles.giphy}><span className={styles.giphy_text}>Powered By Giphy</span><span className={styles.giphy_close} onClick={() => { setGif(false); setSearch(''); clearSearchBox(); }}>CLOSE</span></div> }
            {!(isMinized) && <div className={styles.input_message}>
                <input onKeyDown={handleKey} type="text" id="msg" autoComplete="off" placeholder={suggestion} style={{
                    width: (theatreMode ? '95%': '70%')
                }}></input>
                {!theatreMode && <Button width={true} onClick={sendMessage}>
                    {gif ? 'search' : 'send'}
                </Button>}
            </div>}
        </div>
    )
}

export default Chat
