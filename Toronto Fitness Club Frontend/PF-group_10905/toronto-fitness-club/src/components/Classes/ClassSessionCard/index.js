//list all upcoming sessions of a class when user clicks on a class

import React, { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import moment from "moment";

const ClassSessionCard = ({ classList, classSelection }) => {

    useEffect(() => {
    }, [classList]);

    const UserLoggedIn = true;
    const sessions = (classList, classSelection) => {
        let output = [];

        for (let i = 0; i < classList.length; i++) {
            let tfc_class = classList[i].tfc_class.id;
            if (tfc_class === classSelection && classList[i].tfc_class.capacity > 0 ) {
                output.push(classList[i]);
            }
        }
        return output;

    }

    return (
        <>
            {sessions.length > 0 && 
                <>
                <h1>Sessions</h1>
                <Table striped bordered hover variant="dark">
                    <thead >
                        <tr>
                            <th> ID </th>
                            <th> Time </th>
                            <th> Session Length </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions(classList, classSelection).map((session) => (
                            //set the onClick to a function that sets the classSelection to the tfc_class
                            <tr key={session.id}>
                                <td>{session.id}</td>
                                <td>{moment(session.time).utc().format('YYYY-MM-DD')}</td>
                                <td>{session.session_length}</td>
                            </tr>

                        ))}
                    </tbody>
                </Table >
            </>
            }
        </>
    )
}

export default ClassSessionCard;