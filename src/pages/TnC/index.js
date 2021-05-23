import React from 'react';
import data from '../../content/TnC.json';
import styles from './styles.module.css';

function TnC() {

    const createMarkup = (data) => {
        return {
            __html: data
        };
    }

    const handleBody = (body) => {
        const elements = [];
        body.forEach((item) => {
            if(item.type === "text"){
                elements.push(<div>
                    {item.title && <div className={styles.text_body_title}>{item.title}</div>}
                    <p>{item.data}</p>
                </div>);
            }else if(item.type === "bullet"){
                const newElement = [];
                if(item.title){
                    newElement.push(<div className={styles.text_body_title}>{item.title}</div>)
                }
                const listElement = [];
                item.data.forEach((list) => {
                    listElement.push(<li>{list}</li>)
                });
                newElement.push(<ul className={styles.list}>
                    {listElement}
                </ul>);
                console.log(newElement);
                elements.push(newElement);
            }
        });
        return elements;
    }

    return (
        <div className={styles.body}>
            <h1 className={styles.heading}>{data.title}</h1>
            <div className={styles.sections}>
                {data.sections.map((section) => {
                    return <div className={styles.section}>
                        <div className={styles.section_title}>{section.title}</div>
                        {handleBody(section.body)}
                    </div>
                })}
            </div>
        </div>
    )
}

export default TnC
