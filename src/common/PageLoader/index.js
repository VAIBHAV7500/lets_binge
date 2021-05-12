import React, { useEffect } from 'react'
import styles from './style.module.css';
import PuffLoader from "react-spinners/PuffLoader";
import config from '../../config';
import SvgIcon from '../SvgIcon';
import Typewriter from "typewriter-effect";

const override = `
    position:fixed;
    left: 45%;
    top: 50%;
`;

const totalSVGs = config.TOTAL_LOADING_SVG;
const random = Math.floor((Math.random() * totalSVGs) + 1);
const icon = `loading_${random}.svg`;

function PageLoader({title}) {

    return (
        <div className={styles.shadow}>
                <SvgIcon
                    src={icon}
                    className={styles.svg}
                    width="50%"
                    height="50%"
                    center={true}
                ></SvgIcon>
                <div className={styles.title}>
                    <Typewriter
                        options={{
                            strings: [title],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
        </div>
    )
}

export default PageLoader