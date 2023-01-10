//register user and add them to the database if they haven't registered before
import {useState} from "react";
import "./style.css";

const Register = () => {

    const [params, setParams] = useState({username: "", password: "", first_name: "", last_name: "", email: "", avatar: null, phone_number: ""})
    const [message, setMessage] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [firstnameError, setFirstNameError] = useState("")
    const [lastnameError, setLastNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [avatarError, setAvatarError] = useState("")
    const [phoneNumberError, setPhoneNumberError] = useState("")

    const sendRegisterRequest = () => {
        const { username, password, first_name, last_name, email, avatar, phone_number} = params;

        let errorFound = false;

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password, first_name: first_name, last_name: last_name, email: email, avatar: avatar, phone_number: phone_number})
        }
        fetch(`http://localhost:8000/users/signup/`, requestOptions)
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

                setMessage("You have successfully registered.")
            })
            .catch((error) => {
                setMessage("")
                if ("username" in error) {
                    setUsernameError(error["username"])
                } else {
                    setUsernameError("")
                }
                if ("password" in error) {
                    setPasswordError(error["password"])
                } else {
                    setPasswordError("")
                }
                if ("first_name" in error) {
                    setFirstNameError(error["first_name"])
                } else {
                    setFirstNameError("")
                }
                if ("last_name" in error) {
                    setLastNameError(error["last_name"])
                } else {
                    setLastNameError("")
                }
                if ("email" in error) {
                    setEmailError(error["email"])
                } else {
                    setEmailError("")
                }
                if ("avatar" in error) {
                    setAvatarError(error["username"])
                } else {
                    setAvatarError("")
                }
                if ("phone_number" in error) {
                    setPhoneNumberError(error["phone_number"])
                } else {
                    setPhoneNumberError("")
                }
            })
    }

    return (
        <>  <div className="container">
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
                <div className="errorMessage">{usernameError}</div>
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
                    Email:
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
                    Phone Number:
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
                    onClick={()=>{
                        sendRegisterRequest()
                    }}
                >Register</button>
                <div>{message}</div>
            </div>
        </>
    )
};

export default Register;

