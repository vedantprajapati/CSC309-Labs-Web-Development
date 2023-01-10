//display a user's upcoming payments if theyre logged in
//if the user doesnt have a subscription, say you dont have a subscription
import {React, useContext, useState, useEffect} from 'react'
import APIContext from "../../../../../Contexts/APIContext";
import Table from 'react-bootstrap/Table';

const UpcomingPaymentsCard = () => {

    const [futurePayments, setFuturePayments] = useState([])
    const context = useContext(APIContext);
    const getUpcomingPayments = () => {
        const requestOptions = {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.getItem("authToken")}`},
        }
        fetch(`http://localhost:8000/subscriptions/payments/future/`, requestOptions)
            .then(res => res.json())
            .then(json => {
                if ("error" in json) {
                    return Promise.reject(json["error"])
                }
                else{
                    let tmp = [];
                    for (let i = 0; i < Object.keys(json["Future Payment Dates"]).length; i++) {
                        const obj = json["Future Payment Dates"][i];
                        tmp.push(obj)
                    }
                    setFuturePayments(tmp)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        getUpcomingPayments()
    }, []);


    return (
        <>
        <h1>Future Payments</h1>
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th> Payment Date </th>
                    <th> Amount ($) </th>
                </tr>
            </thead>
            <tbody>
                {futurePayments && futurePayments.map((futurePayment) => (
                    <tr key={futurePayment.date}>
                        <td>{futurePayment.date}</td>
                        <td>{futurePayment.amount}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}

export default UpcomingPaymentsCard