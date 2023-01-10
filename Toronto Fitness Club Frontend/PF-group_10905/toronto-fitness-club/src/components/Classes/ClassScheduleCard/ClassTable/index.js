import { React, useContext, useEffect, useState } from "react";
import APIContext from "../../../../Contexts/APIContext";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';

const ClassTable = ({ classList, setClassSelection, coachList}) => {
    const context = useContext(APIContext);
    // filter out classes that share the same tfc_class.name
    const classSet = (classList) => {
        let output = [];
        let seen = {};
        for (let i = 0; i < classList.length; i++) {
            let tfc_class = classList[i].tfc_class;
            if (!(tfc_class.name in seen)) {
                output.push(tfc_class);
                seen[tfc_class.name] = true;
            }
        }
        return output;

    }


    return (
        <>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Class Name </th>
                        <th> Description </th>
                        <th> Capacity </th>
                        <th> Coach </th>
                        <th> Keywords </th>
                        <th> Last Modified </th>
                        <th> Start Date </th>
                        <th> End Date </th>
                    </tr>
                </thead>
                <tbody>
                    {classSet(classList).map((tfc_class) => (
                        //set the onClick to a function that sets the classSelection to the tfc_class
                        <tr onClick={() => setClassSelection(tfc_class.id)} key={tfc_class.name}>
                            <td>{tfc_class.id}</td>
                            <td>{tfc_class.name}</td>
                            <td>{tfc_class.description}</td>
                            <td>{tfc_class.capacity}</td>
                            <td>{tfc_class.coach}</td>
                            <td>{tfc_class.keywords ? tfc_class.keywords.map((keyword) => (
                                <p>{keyword}</p>
                            )) : ""}</td>
                            <td>{tfc_class.last_modified}</td>
                            <td>{tfc_class.start_date.substr(0, 10)} at {tfc_class.start_date.substr(11, 7)}</td>
                            <td>{tfc_class.end_date}</td>
                        </tr>

                    ))}
                </tbody>
            </Table >
            {/* <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Coach </th>
                    </tr>
                </thead>
                <tbody>
                    {coachList && coachList.map((coach) => (
                        <tr key={coach.id}>
                            <td>{coach.id}</td>
                            <td>{coachList[coach]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table > */}
        </>
    );
}

export default ClassTable;
