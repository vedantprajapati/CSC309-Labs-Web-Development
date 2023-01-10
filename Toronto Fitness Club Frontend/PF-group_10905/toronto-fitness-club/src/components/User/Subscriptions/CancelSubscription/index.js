//display and allow a user to be able to subscribe to a plan. note, re-enrolling means their next billing period will be with the new plan
//also display the user's payment history (past invoices) (paginated)
//also display the user's next billing date (if they have a plan)
//also display the user's future billing dates (paginated)


import React from "react";
import {useState,useContext} from "react";
import { useNavigate } from "react-router-dom";
import APIContext from "../../../../Contexts/APIContext";
// import "./style.css";

const CancelSubscription = () => {

    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    const context = useContext(APIContext);

    const sendCancelSubscriptionRequest = () => {
        const requestOptions = {
            method: "PATCH",
            headers: {"Authorization": `Bearer ${localStorage.getItem("authToken")}`},
        }
        fetch(`http://localhost:8000/subscriptions/cancel/`, requestOptions)
            .then(res => res.json())
            .then(json => {
                if ("error" in json) {
                    return Promise.reject(json["error"])
                }
                context.setSubscriptionId(0)
                setMessage("You have successfully cancelled your subscription.")
            })
            .catch((error) => {
                setMessage(error)
                if ("code" in error && error["code"] === "token_not_valid") {
                    alert("Your session has expired.")
                    navigate("/logout")
                }
            })
    }

    sendCancelSubscriptionRequest()

    return (
        <>
            <div id="not-found">
                <h1 id="centered">
                    {message}
                </h1>
            </div>
        </>
    )
};

export default CancelSubscription;
