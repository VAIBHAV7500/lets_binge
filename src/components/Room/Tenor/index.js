import React, { useEffect, useState } from 'react';
import tenor from './tenor';
import styles from './styles.module.css';
let next = 0;
let limit = 20;

const Tenor = ({searchKey,height,width, onClickGIF}) => {

    const [data, setData] = useState([]);
    
    useEffect(() => {
        console.log(searchKey);
        next = 0;
        setData([]);
        handleSearch(true);
    },[searchKey]);

    useEffect(() => {
        if(searchKey){
            handleSearch();
        }else{
            handleTrending();
        }

        return () => {
            setData([]);
        }
    },[]);

    const getMedia = (response) => {
        const results = response.results;
        const media = results.map((result) => {
            const media = result.media;
            const gifArray = media.map((x) => x.gif);
            const gif = gifArray[0];
            const tinyGIFArray = media.map((x) => x.tinygif)
            const tinyGIF = tinyGIFArray[0];
            return {
                gif: gif.url,
                tinyGIF: tinyGIF?.url || gif.url
            }
        });
        console.log(media);
        return media;
    }

    const handleSearch = async (change = false) => {
        if(searchKey == null || searchKey == ''){
            setData([]);
            handleTrending();
            return;
        }
        const response = (await tenor.search(searchKey,next, limit)).data;
        const media = getMedia(response);
        console.log(media);
        console.log(change);
        next = Number(response.next);
        if(change === true){
            setData(media);
        }else{
            const finalData = data.concat(media);
            const offset = finalData.length % 3;
            if (offset === 0 || offset === 1) {
                next--;
                finalData.pop();
            }
            if (offset === 1) {
                next--;
                finalData.pop();
            }
            console.log('setting final');
            setData(finalData);
        }
    }

    const handleTrending = async () => {
        const response = (await tenor.trending(next)).data;
        const media = getMedia(response);
        next = Number(response.next);
        setData(media);
    }

    const getStyles = () => {
        const styleJson ={
            width: '100%',
            height: '100%'
        }
        return styleJson;
    }

    const getBlockStyle = () => {
        const colors = ['#FF0000', '#FFC000', '#FFFC00', '#00FF00', '#00FFFF', '#FF00FF']
        const styleJson = {
            width: '32%',
            height: '20%',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            display: 'fill',
            margin: '2px'
        }
        return styleJson;
    }

    const onClickGIFExtension = (url) => {
        console.log(url);
        if (onClickGIF){
            onClickGIF(url);
        }
    }

    return (
        <div style={getStyles()} className={styles.gif_wrapper}>
            {data.length !== 0 && data.map((block,index) => {
                return <img key={index} className={styles.block_gif} style={getBlockStyle()} src={block.tinyGIF} alt={"Some GIF"} onClick={() => { onClickGIFExtension(block.gif) }}></img>
            })}
            <span className={styles.load_more} onClick={handleSearch}>Load More...</span>
        </div>
    )
}

export default Tenor
