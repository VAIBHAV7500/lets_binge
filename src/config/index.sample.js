export default {
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
                KEYWORD: 'message'
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
                }
            }
        }
}