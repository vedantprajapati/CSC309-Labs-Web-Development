import {React, useContext} from "react";
import { useState } from "react";
import APIContext from "../../../Contexts/APIContext";

// import "./style.css";


const UserLogin = () => {

    const [params, setParams] = useState({ username: "", password: "" })
    const [message, setMessage] = useState("")
    const context = useContext(APIContext)

    const sendLoginRequest = () => {
        const { username, password } = params;
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        }
        fetch(`http://localhost:8000/users/login/`, requestOptions)
            .then(res => res.json())
            .then(json => {
                if ("error" in json) {
                    return Promise.reject(json["error"])
                }
                localStorage.setItem('authToken', json["token"]);
                localStorage.setItem('avatar', json["user"]["avatar"]);
                setMessage("You have successfully logged in.")
            })
            .catch((error) => {
                setMessage(error)
            })
    }

    return (
        <>
            <div style={{ top: "50%", left: "50%" }}>

                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        onChange={(event) => {
                            setParams({
                                ...params,
                                username: event.target.value,
                            })
                        }}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        onChange={(event) => {
                            setParams({
                                ...params,
                                password: event.target.value,
                            })
                        }}
                    />
                </label>
                <button
                    onClick={() => {
                        sendLoginRequest();
                    }}
                >Login</button>
                <div>{message}</div>
            </div>
        </>
    )
};

export default UserLogin;

