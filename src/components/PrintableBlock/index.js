import React from 'react';
import styles from './styles.module.css';

function PrintableBlock({data}) {

    const handlePrint = () => {
        window.print();
    }

    const parseText = (text) => {
        return {__html: text};
    }

    const handleBody = (body) => {
        const elements = [];
        body.forEach((item) => {
            if(item.type === "text"){
                elements.push(<div>
                    {item.title && <div className={styles.text_body_title}>{item.title}</div>}
                    <p dangerouslySetInnerHTML={{__html: item?.data}}/>
                </div>);
            }else if(item.type === "bullet"){
                const newElement = [];
                if(item.title){
                    newElement.push(<div className={styles.text_body_title}>{item.title}</div>)
                }
                const listElement = [];
                item.data.forEach((list) => {
                    listElement.push(<li dangerouslySetInnerHTML={{__html: list}} />)
                });
                newElement.push(<ul className={styles.list}>
                    {listElement}
                </ul>);
                elements.push(newElement);
            }
        });
        return elements;
    }

    return (
        <div className={styles.body}>
            <button width={true} className={styles.print} onClick={handlePrint}>Print</button>
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

export default PrintableBlock;
