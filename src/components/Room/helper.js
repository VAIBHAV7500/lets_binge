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

const getMessage = (messageArray, username) => {
    const length = messageArray.length;
    if (length !== 0) {
        const index = Math.floor(Math.random() * length);
        const message = messageArray[index];
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
    return members.some(x => x.username === username)?.length === 0 ? false : true;
}

const userExists = (members, member) => {
    return ( usernameExists(members,member.username) === true && members.some(x => x.id === member.id).length !== 0 );
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

export default {
    checkDomain,
    checkURL,
    getMessage,
    getTimeDiff,
    addMemberToList,
    userExists,
    usernameExists,
    getUserById,
    removeMemberFromList,
    getUserByName
}
