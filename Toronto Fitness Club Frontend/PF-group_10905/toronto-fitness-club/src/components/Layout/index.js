import {useContext} from "react";
import APIContext from "../../Contexts/APIContext";
import { Outlet } from "react-router-dom";
import React from "react";
import NavBar from "../NavBar";
import Footer from "../Footer";
import "./style.css";


const Layout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    )
}

// const Layout = () => {
//     return (
//         <>
//             <NavBar isLoggedIn={true}/>
//             <Outlet />
//             <Footer />

//         </>
//     )
// }

export default Layout;
