//logout function/api call
import React from "react";
// import "./style.css";

const Logout = () => {
    // Delete auth token?

    localStorage.removeItem("authToken")
    localStorage.removeItem("avatar")

    return (
        <>
            <div id="not-found">
                <h1 id="centered">
                    You have been logged out.
                </h1>
            </div>
        </>
    )
};

export default Logout;

