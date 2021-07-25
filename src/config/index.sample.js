const config = {
    ALLOWED_DOMAINS: ['music.youtube.com', 'youtube.com'],
    CONVERT_DOMAINS: {
        'music.youtube.com': 'youtube.com'
    },
    DEFAULT_SRC: "https://www.youtube.com/watch?v=7bv_eqtkKqQ",
    FIREBASE: {
        API_KEY: "api_key",
        AUTH_DOMAIN: "auth_domain",
        PROJECT_ID: "your_project_id",
        STORAGE_BUCKET: "storage_bucket",
        MESSAGING_SENDER_ID: "sender_id",
        APP_ID: "app_id",
        MEASUREMENT_ID: "measurement_id"
    },
    USERNAME_KEY: 'username',
    BUFFER_TIME: 5,
    TOTAL_LOADING_SVG: 8,
    TENOR: {
        KEY: 'some_key'
    },
    TWITCH: {
        CLIENT_ID: 'abcd',
        ACCESS_TOKEN: 'abcdef',
    },
    EVENT: {
        ADD: {
            KEYWORD: 'add',
            MESSAGE: [
                'Say Hi to ${user}',
                '${user} is here!',
                'Look ${user} is here'
            ]
        },
        REMOVE: {
            KEYWORD: 'remove',
            MESSAGE: [
                '${user} left'
            ]
        },
        MESSAGE: {
            KEYWORD: 'message',
            MESSAGE: []
        },
        LOAD: {
            KEYWORD: 'load',
            MESSAGE: [
                '${user} has loaded another video'
            ]
        },
        GIF: {
            KEYWORD: 'giphy',
            MESSAGE: []
        },
        PLAYLIST: {
            KEYWORD: 'playlist_update',
            MESSAGE: []
        },
        USERNAME_UPDATE: {
            KEYWORD: 'username_update',
            MESSAGE: [
                'Updated username from ${prev_user} to ${user}'
            ]
        },
        SETTINGS: {
            KEYWORD: 'settings',
            MESSAGE: [
                '${user} updated settings'
            ]
        },
        DESTROY: {
            KEYWORD: 'destroy_room',
            MESSAGE: []
        },
        PLAYER: {
            PLAY: {
                KEYWORD: 'play',
                MESSAGE: [
                    '${user} started playing!'
                ]
            },
            PAUSE: {
                KEYWORD: 'pause',
                MESSAGE: [
                    '${user} paused the video!'
                ]
            },
            SEEK_FORWARD: {
                KEYWORD: 'seek_forward',
                MESSAGE: [
                    '${user} forwarded it!'
                ]
            },
            SEEK_BACKWARD: {
                KEYWORD: 'seek_backward',
                MESSAGE: [
                    '${user} backwarded it!'
                ]
            },
        }
    },
    USERNAME_ERROR: 'Username already exists',
    CHAT_SUGGESTIONS: [
        'Say Hi!',
        'Try "/GIPHY Hello"',
        'Press Enter to send message'
    ],
}

export default config;
