//show a user's profile and their information
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const UserProfile = () => {

    const [params, setParams] = useState({ username: "", password: "", first_name: "", last_name: "", email: "", avatar: null, phone_number: "" })
    const [message, setMessage] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [firstnameError, setFirstNameError] = useState("")
    const [lastnameError, setLastNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [avatarError, setAvatarError] = useState("")
    const [phoneNumberError, setPhoneNumberError] = useState("")


    const navigate = useNavigate()

    const sendEditProfileRequest = () => {
        const { username, password, first_name, last_name, email, avatar, phone_number } = params;

        let errorFound = false;

        let body = {}
        if (username !== "") {
            body['username'] = username
        }
        if (password !== "") {
            body['password'] = password
        }
        if (first_name !== "") {
            body['first_name'] = first_name
        }
        if (last_name !== "") {
            body['last_name'] = last_name
        }
        if (email !== "") {
            body['email'] = email
        }
        if (phone_number !== "") {
            body['phone_number'] = phone_number
        }


        const formData = new FormData();
        if (avatar !== null) {
            formData.append('avatar', avatar);
        }

        for (const [key, value] of Object.entries(body)) {
            formData.append(key, value)
        }
        const requestOptions = {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
            body: formData,
            credentials: 'include',
        }
        fetch(`http://localhost:8000/users/edit/`, requestOptions)
            .then(res => {
                if (res.status >= 400) {
                    errorFound = true;
                }
                return res.json()
            }
            )
            .then(json => {
                if (errorFound) {
                    return Promise.reject(json)
                }
                setUsernameError("")
                setPasswordError("")
                setFirstNameError("")
                setLastNameError("")
                setEmailError("")
                setAvatarError("")
                setPhoneNumberError("")
                localStorage.setItem("avatar", json["user"]["avatar"])

                setMessage("User profile successfully updated.")
            })
            .catch((error) => {
                console.log(error)
                setMessage("")
                if ("details" in error) {
                    if ("username" in error["details"]) {
                        setUsernameError(error["details"]["username"])
                    }
                    if ("password" in error["details"]) {
                        setPasswordError(error["details"]["password"])
                    }
                    if ("first_name" in error["details"]) {
                        setFirstNameError(error["details"]["first_name"])
                    }
                    if ("last_name" in error["details"]) {
                        setLastNameError(error["details"]["last_name"])
                    }
                    if ("email" in error["details"]) {
                        setEmailError(error["details"]["email"])
                    }
                    if ("avatar" in error["details"]) {
                        setAvatarError(error["details"]["username"])
                    }
                    if ("phone_number" in error["details"]) {
                        setPhoneNumberError(error["details"]["phone_number"])
                    }
                }
                if ("code" in error && error["code"] === "token_not_valid") {
                    alert("Your session has expired.")
                    navigate("/logout")
                }
            })
    }

    return (
        <>  <div className="container">
            <h3>Only Update The Fields You Want To Change</h3>
            <label>
                {"Username: "}
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
            <div className="errorMessage">{usernameError}</div>
            <label>
                {"Password: "}
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
            <div className="errorMessage">{passwordError}</div>
            <label>
                First Name:
                <input
                    type="text"
                    name="first_name"
                    onChange={(event) => {
                        setParams({
                            ...params,
                            first_name: event.target.value,
                        })
                    }}
                />
            </label>
            <div className="errorMessage">{firstnameError}</div>
            <label>
                Last Name:
                <input
                    type="text"
                    name="last_name"
                    onChange={(event) => {
                        setParams({
                            ...params,
                            last_name: event.target.value,
                        })
                    }}
                />
            </label>
            <div className="errorMessage">{lastnameError}</div>
            <label>
                {"Email: "}
                <input
                    type="email"
                    name="email"
                    onChange={(event) => {
                        setParams({
                            ...params,
                            email: event.target.value,
                        })
                    }}
                />
            </label>
            <div className="errorMessage">{emailError}</div>
            <label>
                {"Avatar: "}
                <input type="file" accept="image/png, image/jpeg" onChange={(event) => {
                    setParams({
                        ...params,
                        avatar: event.target.files[0],
                    })
                }}
                />
            </label>
            <div className="errorMessage">{avatarError}</div>
            <label>
                {"Phone Number: "}
                <input
                    type="tel"
                    name="phone_number"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    placeholder="123-4567-8901"
                    onChange={(event) => {
                        setParams({
                            ...params,
                            phone_number: event.target.value,
                        })
                    }}
                />
            </label>
            <div className="errorMessage">{phoneNumberError}</div>
            <button
                onClick={() => {
                    sendEditProfileRequest()
                }}
            >Update Profile</button>
            <div>{message}</div>
        </div>
        </>
    )
};

export default UserProfile;