const Tenor = require("tenorjs");
const config = require('../../../config');
const client = Tenor.client({
    "Key": config.default.TENOR.KEY, // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});


const trendingGifs = async (limit = 20) => {
    const results = await client.Trending.GIFs(limit);
    return results;
}

const searchGif = (key, limit = 20) => {
    return client.Search.Query(key,limit);
}


module.exports = {
    searchGif,
    trendingGifs
}