import config from '../../config';

const checkDomain = (url) => {
    let matched_domain = '';
    for (let i = 0; i < config.ALLOWED_DOMAINS.length; i++) {
        const domain = config.ALLOWED_DOMAINS[i];
        if (url.includes(domain)) {
            matched_domain = domain;
            break;
        }
    }

    if (matched_domain === '') {
        return -1;
    }
    let final_domain = matched_domain;
    if (config.CONVERT_DOMAINS[matched_domain]) {
        final_domain = config.CONVERT_DOMAINS[matched_domain];
    }
    return [matched_domain, final_domain];
}

const checkURL = (url) => {
    url = url.trim();
    const result = checkDomain(url);
    if (Array.isArray(result)) {
        return url.replace(result[0], result[1]);
    } else {
        return url;
    }
}

const getMessage = (messageArray, username, event_message) => {
    const length = messageArray.length;
    if (length !== 0) {
        const index = Math.floor(Math.random() * length);
        let message = messageArray[index];
        if(event_message){
            // eslint-disable-next-line no-template-curly-in-string
            return message.replace('${prev_user}', event_message).replace('${user}', username);
        }
        // eslint-disable-next-line no-template-curly-in-string
        return message.replace('${user}', username);
    } else {
        return undefined;
    }
}

const getTimeDiff = (time) => {
    const currTime = new Date().getTime();
    return (currTime - time) / 1000; // returning seconds
}

const usernameExists = (members, username) => {
    return members.some(x => x.username === username);
}

const userExists = (members, member) => {
    return ( usernameExists(members,member.username) === true && members.some(x => x.id === member.id));
}

const getUserById = (members, id) => {
    return members.find(member => member.id === id);
}

const getUserByName = (members, name) => {
    return members.find(member => member.username === name);
}

const addMemberToList = (members, newMember) => {
    const list = [...members];
    if (!userExists(members, newMember)){
        list.push({
            id: newMember.id,
            username: newMember.username,
            isHost: newMember.isHost
        });
    }
    return list;
}

const removeMemberFromList = (members, id) => {
    const list = [...members];
    return list.filter(member => member.id !== id);
}

const copyURL = () => {
    try{
        const dummy = document.createElement('input');
        const url = window.location.href;
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        return true;
    }catch(e){
        return false;
    }
}

/* View in fullscreen */
const openFullscreen = () => {
    var elem = document.getElementById('room');
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
const closeFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
}


const helper = {
    checkDomain,
    checkURL,
    getMessage,
    getTimeDiff,
    addMemberToList,
    userExists,
    usernameExists,
    getUserById,
    removeMemberFromList,
    getUserByName,
    copyURL,
    openFullscreen,
    closeFullscreen
}

export default helper
