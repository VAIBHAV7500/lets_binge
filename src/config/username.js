const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const filePath = '../content/username.txt';

const getUsernames = async () => {
    const data = await readFile(filePath);
    return data;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getUsernames
};