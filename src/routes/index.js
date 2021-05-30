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
        exact: true,
        component: "TnC",
    },{
        path: ["/privacy-policy"],
        exact: true,
        component: "PrivacyPolicy",
    }
]

export default routes;