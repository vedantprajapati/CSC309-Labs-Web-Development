import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
} from "@material-ui/core";
import "./style.css"

const Footer = () => {
    return (
        <footer>
            <AppBar position="static"  elevation={0} color='transparent' >
                <Toolbar style={{ position: "fixed" , bottom:"0", right:"0"}}  >
                    <Typography variant="caption" id="footer" >©2022 Vedant Prajapati, Kyle Blackie</Typography>
                </Toolbar>
            </AppBar>
        </footer>
    )
};

export default Footer;