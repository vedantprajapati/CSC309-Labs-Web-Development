import React from "react";
import {useState, useEffect, useContext} from "react";
import Table from 'react-bootstrap/Table';
import APIContext from "../../../../Contexts/APIContext";


const ListSubscriptions = () => {

    const [subscriptionList, setSubscriptionList] = useState([])
    const context = useContext(APIContext);
    const sendGetSubscriptionsRequest = () => {
        const requestOptions = {
            method: "GET",
        }
        fetch(`http://localhost:8000/subscriptions/list/`, requestOptions)
            .then(res => res.json())
            .then(json => {
                if ("error" in json) {
                    return Promise.reject(json["error"])
                }
                setSubscriptionList(json["results"])


            })
            .catch((error) => {

            })
    }

    useEffect(() => {
        sendGetSubscriptionsRequest()
    }, []);

    const handleSubscribe = (subscriptionId) => {
        const isLoggedIn = () => { return localStorage.getItem("authToken") !== null }
        if (isLoggedIn()===false) {
            return Promise.reject("User not logged in.")
        }
        else{
            const requestOptions = {
                method: "PATCH",
                headers: {"Authorization": `Bearer ${localStorage.getItem("authToken")}`},
            }
            fetch(`http://localhost:8000/subscriptions/subscribe/${subscriptionId}/`, requestOptions)
                .then(res => res.json())
                .then(json => {
                    if ("error" in json) {
                        return Promise.reject(json["error"])
                    }
                    else{
                        context.setSubscriptionId(subscriptionId)    
                        alert(json.message)
                    }
                })
                .catch((error) => {
    
                })
        }
    }

    return (
        <>
        <h1>Click on a Subscription to Subscribe!</h1>
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th> Subscription Id</th>
                    <th> Cost ($) </th>
                    <th> Payments Every _ Months </th>
                </tr>
            </thead>
            <tbody>
                {subscriptionList.map((subscription) => (
                    <tr onClick={()  => handleSubscribe(subscription.id)} key={subscription.id}>

                        <td>{subscription.id}</td>
                        <td>{subscription.cost}</td>
                        <td>{subscription.term_length}</td>
                    </tr>
                ))}

            </tbody>
        </Table>
        </>
    )
};

export default ListSubscriptions;