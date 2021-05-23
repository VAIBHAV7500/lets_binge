const settings = {
    title: "Settings",
    sections: [
        {
            key: "room_settings",
            title: "",
            inputs: [
                {
                    key: "room_name",
                    title: "Room Name (Visible on Tab)",
                    type: "input",
                    sub_type: "text",
                    value: "",
                    placeholder: 'Enter Room Name'
                },{
                    key: "lock",
                    title: "Lock Room",
                    type: "input",
                    sub_type: "toggle",
                    value: false
                }, {
                    key: "playlist_allow",
                    title: "Allow Members to Update Playlist",
                    type: "input",
                    sub_type: "toggle",
                    value: true
                }, {
                    key: "username_update",
                    title: "Allow Members to Update Username",
                    type: "input",
                    sub_type: "toggle",
                    value: true
                }
            ]
        }
    ]
}

export default settings;