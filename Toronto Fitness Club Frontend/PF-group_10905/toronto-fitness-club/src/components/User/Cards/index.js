//display and allow user to update their card


import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const AddPaymentMethod = () => {

    const [params, setParams] = useState({card_type: "CR", card_number: "", card_holder_name: "", expiry_date: "", security_code: ""})
    const [message, setMessage] = useState("")
    const [cardTypeError, setCardTypeError] = useState("")
    const [cardNumberError, setCardNumberError] = useState("")
    const [cardHolderNameError, setCardHolderNameError] = useState("")
    const [expiryDateError, setExpiryDateError] = useState("")
    const [securityCodeError, setSecurityCodeError] = useState("")


    const navigate = useNavigate()

    const sendCardCreateRequest = () => {
        const { card_type, card_number, card_holder_name, expiry_date, security_code} = params;

        let errorFound = false;

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("authToken")}`},
            body: JSON.stringify({card_type: card_type, card_number: card_number, card_holder_name: card_holder_name, expiry_date: expiry_date, security_code: security_code})
        }
        fetch(`http://localhost:8000/users/card/create/`, requestOptions)
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
                setCardTypeError("")
                setCardNumberError("")
                setCardHolderNameError("")
                setExpiryDateError("")
                setSecurityCodeError("")

                setMessage("Card successfully added.")
            })
            .catch((error) => {
                setMessage("")
                if ("details" in error) {
                    if ("card_type" in error["details"]) {
                        setCardTypeError(error["details"]["card_type"])
                    } else {
                        setCardTypeError("")
                    }
                    if ("card_number" in error["details"]) {
                        setCardNumberError(error["details"]["card_number"])
                    } else {
                        setCardNumberError("")
                    }
                    if ("card_holder_name" in error["details"]) {
                        setCardHolderNameError(error["details"]["card_holder_name"])
                    } else {
                        setCardHolderNameError("")
                    }
                    if ("expiry_date" in error["details"]) {
                        setExpiryDateError(error["details"]["expiry_date"])
                    } else {
                        setExpiryDateError("")
                    }
                    if ("security_code" in error["details"]) {
                        setSecurityCodeError(error["details"]["security_code"])
                    } else {
                        setSecurityCodeError("")
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
                <label>
                    Card Type:
                    <select id="cards" name="cards"
                    onChange={(event) => {
                        setParams({
                            ...params,
                            card_type: event.target.value,
                        })
                    }}>
                        <option value="CR">Credit Card</option>
                        <option value="DB">Debit Card</option>
                    </select>
                </label>
                <div className="errorMessage">{cardTypeError}</div>
                <label>
                    Card Number:
                    <input
                        type="text"
                        name="card_number"
                        onChange={(event) => {
                            setParams({
                                ...params,
                                card_number: event.target.value,
                            })
                        }}
                    />
                </label>
                <div className="errorMessage">{cardNumberError}</div>
                <label>
                    Card Holder Name:
                    <input
                        type="text"
                        name="card_holder_name"
                        onChange={(event) => {
                            setParams({
                                ...params,
                                card_holder_name: event.target.value,
                            })
                        }}
                    />
                </label>
                <div className="errorMessage">{cardHolderNameError}</div>
                <label>
                    Expiry Date:
                    <input
                        type="date"
                        name="expiry_date"
                        onChange={(event) => {
                            setParams({
                                ...params,
                                expiry_date: event.target.value,
                            })
                        }}
                    />
                </label>
                <div className="errorMessage">{expiryDateError}</div>
                <label>
                    Security Code:
                    <input
                        type="text"
                        name="security_code"
                        onChange={(event) => {
                            setParams({
                                ...params,
                                security_code: event.target.value,
                            })
                        }}
                    />
                </label>
                <div className="errorMessage">{securityCodeError}</div>
                <button
                    onClick={()=>{
                        sendCardCreateRequest()
                    }}
                >Add Payment Method</button>
                <div>{message}</div>
            </div>
        </>
    )
};

export default AddPaymentMethod;

