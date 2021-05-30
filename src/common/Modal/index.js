import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';
import {Switch} from 'antd';

let data;

function Modal({showModal, title, onSubmit, onCancel, body, showHook}) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleCancel = () => {
        setIsModalVisible(false);
        showHook(false);
        if(onCancel){
            onCancel();
        } 
    };

    const handleOk = () => {
        setIsModalVisible(false);
        showHook(false);
        if(onSubmit){
            onSubmit(data);
        }
    };

    const handleOnChangeInput = (key, value) => {
        const sections = data.sections;
        sections.forEach((section, section_index) => {
            section.inputs.forEach((input, input_index) => {
                if(input.key === key){
                    data.sections[section_index].inputs[input_index].value = value;
                }
            });
        });
    }

    const handleSectionInputs = (input) => {
        const elements = [];
        elements.push(<div className={styles.input_title}>{input.title}</div>)
        if(input.type === "input"){
            if(input.sub_type === "text"){
                elements.push(<input type="text" className={styles.input_text} placeholder={input.placeholder} defaultValue={input.value} onChange={(event) => { handleOnChangeInput(input.key, event.target.value) }}/>)
            }else if(input.sub_type === "toggle"){
                elements.push(<Switch defaultChecked={input.value} onChange={(event) => { handleOnChangeInput(input.key, event) }} />)
            }
        }
        return <div className={styles.input} key={input.key}>{elements}</div>
    }

    const generateBody = (data) => {
        const elements = [];
        const sections = data.sections;
        if(sections){
            sections.forEach((section, index) => {
                elements.push(<div className={styles.section} key={index}>
                    <div className={styles.section_title}>
                        {section.title || ''}
                    </div>
                    <div className={styles.section_form}>
                        {section.inputs.map((input) => {
                            return handleSectionInputs(input);
                        })}
                    </div>
                </div>)
            });
        }
        return elements;
    }

    const generateFooter = (buttons) => {
        const elements =[];
        if(buttons == null){
            buttons = [{
                type: "submit"
            },{
                type: "back"
            }]
        }
        buttons.forEach((button) => {
            if(button.type === "submit"){
                elements.push(<button key="submit" onClick={handleOk} className={styles.btn}>
                    {button.text || "OK"}
                </button>);
            }else if(button.type === "back"){
                elements.push(<button key="back" onClick={handleCancel} className={styles.btn}>
                    {button.text || "Cancel"}
                </button>);
            }else{
                elements.push(<button key={button.key} onClick={button.onClick} className={styles.btn}>
                    {button.text}
                </button>);
            }
        });
        return elements;
    }

    const generateModal = () => {
        if(!isModalVisible){
            return <></>;
        }
        return (<div className = {styles.modal}>
            <div className={styles.modal_container}>
                <div className={styles.header}>
                    <p className={styles.title}>{title}</p>
                    <span className={styles.close} onClick={handleCancel}>❌</span>
                </div>
                <div className={styles.body}>
                    {generateBody(body)}
                </div>
                <div className={styles.footer}>
                    {generateFooter(body.buttons || [])}
                </div>
            </div>
        </div>);
    }

    useEffect(() => {
        setIsModalVisible(showModal);
        data = body;
    },[showModal]);

    return generateModal();
};

export default Modal
