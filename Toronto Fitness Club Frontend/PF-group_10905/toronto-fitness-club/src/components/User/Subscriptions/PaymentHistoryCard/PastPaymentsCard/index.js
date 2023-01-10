//display a user's upcoming payments if theyre logged in
//if the user doesnt have a subscription, say you dont have a subscription
import {React, useContext, useState, useEffect} from 'react'
import APIContext from "../../../../../Contexts/APIContext";
import Table from 'react-bootstrap/Table';

const PastPaymentsCard = () => {


    const [pastPayment, setPastPayments] = useState([])
    const context = useContext(APIContext);
    const getPastPayments = () => {
        const requestOptions = {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.getItem("authToken")}`},
        }
        fetch(`http://localhost:8000/subscriptions/payments/history/`, requestOptions)
            .then(res => res.json())
            .then(json => {
                if ("error" in json) {
                    return Promise.reject(json["error"])
                }
                else{
                    console.log(json["results"])
                    setPastPayments(json["results"])
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    useEffect(() => {
        getPastPayments()
    }, []);

    return (
        <>
        <h1>Past Payments</h1>
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th> Payment Id</th>
                    <th> Cost ($) </th>
                    <th> Card Number Ending in </th>
                    <th> Payment Dates </th>
                </tr>
            </thead>
            <tbody>
                {pastPayment && pastPayment.map((pastPayment) => (
                    <tr key={pastPayment.id}>
                        <td>{pastPayment.id}</td>
                        <td>{pastPayment.amount}</td>
                        <td>**** **** **** *{pastPayment.card_number.substr(pastPayment.card_number.length - 3)}</td>
                        <td>{pastPayment.date.substr(0,10)} at {pastPayment.date.substr(11,8)}</td>
                    </tr>
                ))}

            </tbody>
        </Table>
        </>
    )
}

export default PastPaymentsCard
