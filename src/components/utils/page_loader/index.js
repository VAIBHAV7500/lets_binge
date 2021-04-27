import React from 'react'
import styles from './page_loader.module.css';
import PuffLoader from "react-spinners/PuffLoader";

const override = `
    position:fixed;
    left: 45%;
    top: 50%;
`;

function PageLoader({title,cover}) {

    const coverBackground = {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
        url(${cover})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }

    return (
        <div className={styles.shadow} style={coverBackground}>
                <div className={styles.title}>{title}</div>
                <PuffLoader loading={true} css={override} size={100} color="white"/>
        </div>
    )
}

export default PageLoader