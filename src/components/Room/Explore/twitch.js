import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';
import config from '../../../config';

const authProvider = new StaticAuthProvider(config.TWITCH.CLIENT_ID, config.TWITCH.ACCESS_TOKEN);
const apiClient = new ApiClient({ authProvider });

const getVideosData = (channels) => {
    const data = [];
    channels.forEach((channel) => {
        data.push({
            id: channel.id,
            title: `${channel.isLive ? '🟢' : '🔴'} ${channel.displayName} playing ${channel.gameName} `,
            thumbnail: channel.thumbnailUrl,
            name: channel.name,
            type: 'twitch'
        });
    });
    return data;
}

const search = async (key) => {
    const channels = await apiClient.helix.search.searchChannels(key);
    return channels.data;
}

export default {
    search,
    getVideosData
}
