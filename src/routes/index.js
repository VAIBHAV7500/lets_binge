const routes = [
    {
        path: ["/", "/home"],
        exact: true,
        component: "Home",
    },{
        path: ["/room"],
        exact: false,
        component: "Room",
    },{
        path: ["/terms-and-conditions"],
        exact: false,
        component: "TnC",
    }
]

export default routes;