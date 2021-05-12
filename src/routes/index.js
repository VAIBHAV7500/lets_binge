const routes = [
    {
        path: ["/", "/home"],
        exact: true,
        component: "Home",
    },{
        path: ["/room"],
        exact: false,
        component: "Room",
    }
]

export default routes;