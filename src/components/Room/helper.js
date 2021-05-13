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


export default {
    checkDomain,
    checkURL,
    getMessage
}
