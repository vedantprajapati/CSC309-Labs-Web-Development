//list the users's upcoming classes andbe able to modify their cart
import React from "react";
import { useState, useEffect, useContext } from "react";
import Table from 'react-bootstrap/Table';
import APIContext from "../../../Contexts/APIContext";


const UpcomingSessionsCard = () => {

    const [upcomingSessionsList, setUpcomingSessionsList] = useState([])
    const context = useContext(APIContext);
    const [prevURL, setPrevURL] = useState(`http://localhost:8000/classes/schedule/?`);
    const [nextURL, setNextURL] = useState(`http://localhost:8000/classes/schedule/?`);
    const [currURL, setCurrURL] = useState(`http://localhost:8000/classes/schedule/?`);
    const sendGetScheduleRequest = () => {
        const requestOptions = {
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
        }
        fetch(currURL, requestOptions)
            .then(res => res.json())
            .then(json => {
                if ("error" in json) {
                    return Promise.reject(json["error"])
                }
                setUpcomingSessionsList(json["results"])
                setNextURL(json.next)
                setPrevURL(json.previous)

            })
            .catch((error) => {

            })
    }

    useEffect(() => {
        sendGetScheduleRequest()
    }, [currURL]);


    return (
        <>
            <h1>These are your Upcoming Sessions!</h1>
            <button onClick={() => setCurrURL(prevURL)}>
                {"<"}
            </button>
            <button onClick={() => {
                setCurrURL(nextURL);
            }}>
                {">"}
            </button>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Session ID</th>
                        <th>Class Name</th>
                        <th>Time</th>
                        <th>Session Length</th>
                        <th>Is Cancelled</th>
                    </tr>
                </thead>
                <tbody>
                    {upcomingSessionsList.map((session) => (
                        <tr key={session.id}>
                            <td>{session.id}</td>
                            <td>{session.tfc_class.name}</td>
                            <td>{session.time}</td>
                            <td>{session.session_length}</td>
                            <td>{session.is_cancelled ? "Yes" : "No"}</td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </>
    )
};

export default UpcomingSessionsCard;